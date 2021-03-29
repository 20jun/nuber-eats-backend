import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entitiy";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput } from "src/common/dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users : Repository<User>,
        @InjectRepository(Verification) private readonly verifications : Repository<Verification>,
        private readonly jwtService : JwtService,
    ) {
    }

    async createAccount({email, password, role} : CreateAccountInput) : Promise<{ok : boolean; error? : string}> {
        try {
            const exists = await this.users.findOne({email});
            if(exists) {
                return {ok : false, error : 'There is a user with that email already'};
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verifications.save(this.verifications.create({
                user,
            }))
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
            const user = await this.users.findOne(
                {email}, 
                {select : ['id', 'password']});
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
            console.log(user);
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

    async editProfile(
        userId : number, 
        {email, password} : EditProfileInput,
        ) : Promise<User> {
        const user = await this.users.findOne(userId);
        if(email) {
            user.email = email;
            user.verified = false;
            await this.verifications.save(this.verifications.create({user}));
        }
        if(password) {
            user.password = password;
        }
       return this.users.save(user);
    }

    async verifyEmail(code : string) : Promise<boolean> {
        try {
            const verification = await this.verifications.findOne({code}, {relations : ['user']});
        if(verification) {
            verification.user.verified = true;
            console.log(verification.user);
            this.users.save(verification.user);
            return true;
        }
        throw new Error();
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}