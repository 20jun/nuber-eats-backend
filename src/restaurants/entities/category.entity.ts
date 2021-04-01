import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entitiy";

// 클래스 하나로 graphQL 스키마, DB에 저장되는 실제 데이터의 형식을 만들 수 있음


// ObjectType : 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@InputType('CategoryInputType', {isAbstract : true})
@ObjectType()
@Entity()
export class Category extends CoreEntity {

    // 이건 function이 아니므로 argument에는 뭐가 들어가도 상관없음
    @Field(type => String)
    @Column({unique : true})
    @IsString()
    @Length(5)
    name : string;
    
    @Field(type => String, {nullable : true})
    @Column({nullable : true})
    @IsString()
    coverImg : string;

    @Field(type => String)
    @Column({unique : true})
    @IsString()
    slug : string;

    @Field(type => [Restaurant], {nullable : true})
    @OneToMany(type => Restaurant, restaurant => restaurant.category)
    restaurants : Restaurant[];
}