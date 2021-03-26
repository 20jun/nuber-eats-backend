import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entitiy";
import { UserService } from "./users.service";



@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService : UserService
    ) {}

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput : CreateAccountInput,
        ) : Promise<CreateAccountOutput> {
        try {
            return this.usersService.createAccount(createAccountInput);
        } catch(error) {
            return {
                error,
                ok : false,
            };
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput : LoginInput) : Promise<LoginOutput> {
        try {
            return this.usersService.login(loginInput);
        } catch(error) {
            return {
                ok : false,
                error,
            }
        }
    }

    @Query(returns => User)
    me() {
        
    }
}