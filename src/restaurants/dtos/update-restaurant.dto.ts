import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { fieldToFieldConfig } from "graphql-tools";
import { CreateRestaurantDto } from "./create-restaurant.dto";


@InputType()
// PatialType : 특정 타입의 부분 집합을 만족하는 타입을 정의 가능
class UpdateRestaurantInputType extends PartialType(
    CreateRestaurantDto,
    ) {}


@InputType()
export class UpdateRestaurantDto {
    @Field(type => Number)
    id : number;

    @Field(type => UpdateRestaurantInputType)
    data : UpdateRestaurantInputType;
}