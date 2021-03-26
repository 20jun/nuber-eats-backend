import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entitiy";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users : Repository<User>,
        private readonly jwtService : JwtService,
    ) {
    }

    async createAccount({email, password, role} : CreateAccountInput) : Promise<{ok : boolean; error? : string}> {
        try {
            const exists = await this.users.findOne({email});
            if(exists) {
                return {ok : false, error : 'There is a user with that email already'};
            }
            await this.users.save(this.users.create({email, password, role}));
            return {ok : true};
        } catch(e){
            return {ok : false, error : 'Couldn\'t create account'};
        }
    }
    async login({
        email, password
    } : LoginInput) : Promise<{ok : boolean; error? : string, token? : string}> {
        // 1. find the user with the email
        try {
            const user = await this.users.findOne({email});
            if(!user) {
                return {
                    ok : false,
                    error : 'User not found',
                };
            }
            
            // check if the password is correct
            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect) {
                return {
                    ok : false,
                    error : 'Wrong password',
                }
            }
            // 내부에 담겨진 정보 자체가 아닌, 정보의 진위 여부가 중요하다는 것
            const token = this.jwtService.sign(user.id);
            return {
                ok : true,
                token,
            }
        } catch(error) {
            return {
                ok : false,
                error,
            }
        }
    }
    // make a JWT and give it to the user
    async findById(id : number) : Promise<User>{
        return this.users.findOne({id});
    }
}