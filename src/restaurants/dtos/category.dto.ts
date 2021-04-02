import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Category } from "src/restaurants/entities/category.entity";
import { Restaurant } from "../entities/restaurant.entitiy";


@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    slug : string;
}


@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(type => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
  @Field(type => Category, { nullable: true })
  category?: Category;
}