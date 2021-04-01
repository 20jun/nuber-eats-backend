//resolver가 controller 역할을 함
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entitiy';
import { RestaurantService } from './restaurants.service';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/role.decorator';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { Category } from './entities/category.entity';

import { CategoryInput, CategoryOutput } from 'src/restaurants/dtos/category.dto';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';


@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService : RestaurantService){}
    
    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser : User,
        @Args('input') createRestaurantInput : CreateRestaurantInput,
    ) : Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(authUser, createRestaurantInput);
    }

    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(
        @AuthUser() owner : User,
        @Args('input') editRestaurantInput : EditRestaurantInput,
    ) : Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput);
    }

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(
        @AuthUser() owner : User,
        @Args('input') deleteRestaurantInput : DeleteRestaurantInput,
    ) : Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(
            owner, 
            deleteRestaurantInput
            );
        }



        @Query(returns => RestaurantsOutput)
        restaurants(@Args('input') RestaurantsInput : RestaurantsInput
        ) : Promise<RestaurantsOutput> {
            return this.restaurantService.allRestaurants(RestaurantsInput);
        }


}

@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly restaurantService : RestaurantService) {}

    // 매 request마다 계산된 field를 만들어줌
    @ResolveField(type => Int)
    restaurantCount(@Parent() category : Category) : Promise<number> {
        console.log(category);
        return this.restaurantService.countRestaurants(category);
    }

    @Query(type => AllCategoriesOutput)
    allCategories() : Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }

    @Query(type => CategoryOutput)
    category(@Args('input') categoryInput : CategoryInput) : Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput);
    }
}