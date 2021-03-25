//resolver가 controller 역할을 함
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { number } from 'joi';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entitiy';
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService : RestaurantService){}
    @Query(returns => [Restaurant])
    restaurants() : Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args('input') createRestaurantDto : CreateRestaurantDto
    ) : Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch(e) {
            console.log(e)
            return false;
        }
    }

    @Mutation(returns => Boolean)
    async updateRestaurant(
        @Args('input') updateRestaurantDto : UpdateRestaurantDto
        ) : Promise<boolean> {
            try {
                await this.restaurantService.updateRestaurant(updateRestaurantDto);
                return true;
            } catch(e) {
                console.log(e);
                return false;
            }
    }
}