import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Dish } from "../entities/dish.entity";


@InputType()
export class CreateDishInput extends PickType(Dish, [
    'name',
    'price',
    'description',
    'options',
]) {
    // 어떤 restaurant에 dish를 추가하는지 모르면 dish를 추가할 수 없기 때문에
    @Field(type => Int)
    restaurantId : number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}