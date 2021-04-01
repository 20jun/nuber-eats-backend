import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Role } from "src/auth/role.decorator";
import { EditProfileInput, EditProfileOutput } from "src/common/dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "src/common/dtos/verify-email.dto";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";



@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService : UserService) {}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput : CreateAccountInput,
        ) : Promise<CreateAccountOutput> {
            return this.usersService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput : LoginInput) : Promise<LoginOutput> {
            return this.usersService.login(loginInput);
    }

    @Query(returns => User)
    // authentication : 누가 자원을 요청하는지 확인하는 과정, token으로 identity를 확인
    // authorization : user가 어떤 일을 하기 전에 permission을 가지고 있는지 확인하는 과정
    @Role(['Any'])
    me(@AuthUser() authUser : User) {
        return authUser;
    }
    
    //user의 profile을 볼 수 있는 query
    @Role(['Any'])
    @Query(returns => UserProfileOutput)
    async userProfile(
        @Args() userProfileInput : UserProfileInput,
        ) : Promise<UserProfileOutput>{
            return this.usersService.findById(userProfileInput.userId);
        }
        
        
    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    async editProfile(
        @AuthUser() authUser : User, 
        @Args('input') editProfileInput : EditProfileInput,
    ) : Promise<EditProfileOutput> {
            return this.usersService.editProfile(authUser.id, editProfileInput);  
    }


    @Mutation(returns => VerifyEmailOutput)
    verifyEmail(
        @Args('input') {code} : VerifyEmailInput,
    ) : Promise<VerifyEmailOutput> {
       return this.usersService.verifyEmail(code);
    }
}