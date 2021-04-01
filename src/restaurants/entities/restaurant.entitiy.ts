import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Category } from "./category.entity";

// 클래스 하나로 graphQL 스키마, DB에 저장되는 실제 데이터의 형식을 만들 수 있음


// ObjectType : 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
@InputType('RestaurantInputType',{isAbstract : true})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

    // 이건 function이 아니므로 argument에는 뭐가 들어가도 상관없음
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name : string;
    
    @Field(type => String)
    @Column()
    @IsString()
    coverImg : string;

    @Field(type => String, {defaultValue : "강남"})
    @Column()
    @IsString()
    address : string;


    @Field(type => Category, {nullable : true})
    @ManyToOne(
        type => Category, 
        category => category.restaurants,
        {nullable : true, onDelete : 'SET NULL'}
        )
    category : Category;

    @Field(type => User)
    @ManyToOne(
        type => User, 
        user => user.restaurants,
        { onDelete : 'CASCADE'},
    )
    owner : User;

    @RelationId((restaurant : Restaurant) => restaurant.owner)
    ownerId : number;
}