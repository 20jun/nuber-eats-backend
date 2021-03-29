import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entitiy';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Verification } from './users/entities/verification.entity';

console.log(Joi);
@Module({
  imports: [
    ConfigModule.forRoot({
      // Global로 설정된 Module은 Imports에 넣어줄 필요가 없다.
      isGlobal : true,
      envFilePath : process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile : process.env.NODE_ENV === 'prod',
      validationSchema : Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY : Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize : process.env.NODE_ENV !== 'prod',
      logging : true,
      // TypeOrmModule에 Restaurant라고 하는 entitiy를 가지고있고
      // DB가 됨
      entities : [User, Verification],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context : ({req}) => ({ user : req['user']}),
    }),

    UsersModule,
    JwtModule.forRoot({
      privateKey : process.env.PRIVATE_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer : MiddlewareConsumer) {
    consumer
    .apply(JwtMiddleware)
    .forRoutes({ path : '/graphql', method : RequestMethod.POST });
  }
}
