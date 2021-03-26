// middleware : 요청을 받고 요청 처리 후에 next()함수를 호출
// middleware에서 token을 가져간 다음 그 token을 가진 사용자를 찾아줄거야

import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

// #5.7 headers에서 user를 request에 보내는 middleware까지 구현

// Injectable일때만 inject 할 수 있다는거 명심
@Injectable()
// implements : class가 interface처럼 행동해야 한다
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService : JwtService,
        private readonly userService : UserService,
        ) {}
    async use(req : Request, res : Response, next : NextFunction) {
        console.log(req.headers);
        if('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            const decoded = this.jwtService.verify(token.toString());
            if(typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                try {
                    const user = await this.userService.findById(decoded['id']);
                    req['user'] = user;
                } catch(e) {}
            }
        }
        next();
    }
}