// request를 다음 단계로 진행할지 말지 결정

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


@Injectable()
// CanActivate : true를 return하면 request를 진행시키고 false면 request를 멈추게 함
export class AuthGuard implements CanActivate {
    canActivate(context : ExecutionContext) {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext['user'];
        if (!user) {
            return false;
        }
        return true;
    }

}