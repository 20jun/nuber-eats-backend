import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entitiy';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';

@Module({
    // forFeature : TypeOrmModule이 특정 feature를 import할 수 있게 해줌
    imports : [TypeOrmModule.forFeature([Restaurant])],
    providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
