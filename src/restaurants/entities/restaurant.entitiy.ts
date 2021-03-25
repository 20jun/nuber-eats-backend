import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 클래스 하나로 graphQL 스키마, DB에 저장되는 실제 데이터의 형식을 만들 수 있음


// ObjectType : 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@InputType({isAbstract : true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id : number;
    // 이건 function이 아니므로 argument에는 뭐가 들어가도 상관없음
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name : string;
    
    @Field(type => Boolean, {nullable : true})
    @Column({default : true})
    @IsOptional()
    @IsBoolean()
    isVegan : boolean;
    
    @Field(type => String, {defaultValue : "강남"})
    @Column()
    @IsString()
    address : string;
    
    @Field(type => String)
    @Column()
    @IsString()
    ownersName : string;

    @Field(type => String)
    @Column()
    @IsString()
    categoryName : string;
}