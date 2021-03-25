import { InputType, OmitType } from "@nestjs/graphql";
import { Restaurant } from "../entities/restaurant.entitiy";


@InputType()
// OmitType : 특정 속성만 제거한 타입을 정의
export class CreateRestaurantDto extends OmitType(Restaurant, ["id"]){
   
}