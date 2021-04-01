import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Restaurant } from "../entities/restaurant.entitiy";


@InputType()
// OmitType : 특정 속성만 제거한 타입을 정의
export class CreateRestaurantInput extends PickType(Restaurant, [
    'name',
    'coverImg',
    'address',
]) {
    @Field(type => String)
    categoryName : string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}