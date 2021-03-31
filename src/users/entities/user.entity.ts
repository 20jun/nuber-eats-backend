import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
// 암호를 해시하는데 도움이 되는 라이브러리
import * as bcrypt from 'bcrypt';
import { CoreEntity } from "src/common/entities/core.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum } from "class-validator";


enum UserRole {
    Client,
    Owner,
    Delivery,
}

registerEnumType(UserRole, {name : 'UserRole'});

@InputType({isAbstract : true})
@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Column({ unique : true })
    @Field(type => String)
    @IsEmail()
    email : string;
    
    @Column({select : false})
    @Field(type => String)
    password : string;
    
    @Column({type : 'enum', enum : UserRole})
    @Field(type => UserRole) // type이 UserRole인 graphQL을 가지고 있다
    @IsEnum(UserRole)
    role : UserRole;

    // User의 email이 verify 됐는지 안 됐는지를 저장하기 위해 만듦
    @Column({default : false })
    @Field(type => Boolean)
    verified : boolean;
  id: number;

    // BeforeInsert : DB에 저장하기 전에 password 해시
    @BeforeInsert()
    @BeforeUpdate()
    // async : 비동기
    async hashPassword() : Promise<void> {
        if(this.password) {
            try {
                // bcrypt : 암호를 해시하는데 도움이 되는 라이브러리
                this.password = await bcrypt.hash(this.password, 10);
            } catch(e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(aPassword : string) : Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch(e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}