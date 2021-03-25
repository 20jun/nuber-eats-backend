import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entitiy";


@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant)
    private readonly restaurants : Repository<Restaurant>,
    ) {}
    getAll() : Promise<Restaurant[]> {
        return this.restaurants.find();
    }

    // method : class 안에 있는 function
    createRestaurant(createRestaurantDto : CreateRestaurantDto,
        ) : Promise<Restaurant> {
        const newRestaurant = this.restaurants.create(createRestaurantDto)
        return this.restaurants.save(newRestaurant);
    }

    updateRestaurant({id, data} : UpdateRestaurantDto) {
        return this.restaurants.update(id, {...data});
    }
}