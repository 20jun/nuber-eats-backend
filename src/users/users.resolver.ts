import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { verify } from "jsonwebtoken";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { EditProfileInput, EditProfileOutput } from "src/common/dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "src/common/dtos/verify-email.dto";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entitiy";
import { UserService } from "./users.service";



@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService : UserService) {}
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
    // authentication : 누가 자원을 요청하는지 확인하는 과정, token으로 identity를 확인
    // authorization : user가 어떤 일을 하기 전에 permission을 가지고 있는지 확인하는 과정
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser : User) {
        return authUser;
    }
    
    //user의 profile을 볼 수 있는 query
    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(@Args() userProfileInput : UserProfileInput,
    ) : Promise<UserProfileOutput>{
        try {
            const user = await this.usersService.findById(userProfileInput.userId);
            if(!user) {
                throw Error();
            }
            return {
                ok : true,
                user,
            }
        } catch(e) {
            return {
                error : "User Not Found",
                ok : false,
            };
        }
    }


    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput)
    async editProfile(
        @AuthUser() authUser : User, 
        @Args('input') EditProfileInput : EditProfileInput,
    ) : Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(authUser.id, EditProfileInput);
            return {
                ok : true, 
            }
        } catch(error) {
            return {
                ok : false,
                error,
            };
        }
    }


    @Mutation(returns => VerifyEmailOutput)
    async verifyEmail(@Args('input') {code} : VerifyEmailInput,
    ) : Promise<VerifyEmailOutput> {
        try {
            await this.usersService.verifyEmail(code);
            return {
                ok : true,
            }
        } catch(error) {
            return {
                ok : false,
                error
            }
        }
    }
}