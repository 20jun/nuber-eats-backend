// request를 다음 단계로 진행할지 말지 결정

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { resolveSoa } from "dns";
import { User } from "src/users/entities/user.entity";
import { AllowedRoles } from './role.decorator';

@Injectable()
// CanActivate : true를 return하면 request를 진행시키고 false면 request를 멈추게 함
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector : Reflector) {}
    canActivate(context : ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>(
            'roles',
            context.getHandler() 
            );
            if(!roles) {
                return true;
            }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user : User = gqlContext['user'];
        if (!user) {
            return false;
        }
        if (roles.includes('Any')) {
            return true;
        }
        return roles.includes(user.role);
    }

}