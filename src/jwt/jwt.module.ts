import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
// 이렇게 해주면 매번 수동으로 import로 불러오지 않아도 됨
@Global()
export class JwtModule {
    // forRoot() : Dynamic Module 값을 반환
    static forRoot(options : JwtModuleOptions) : DynamicModule {
        return {
            module : JwtModule,
            // JwtService를 export해서 users.module 에서도 이용할 수 있게 되었다.
            providers : [
                {
                provide : CONFIG_OPTIONS,
                useValue : options,
                },
                JwtService,
            ],
            exports : [JwtService],
        }
    }
}
