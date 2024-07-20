import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteOffers } from './favoriteOffers.entity';
import { User } from 'src/users/users.entity';
import { Offer } from 'src/offer/offer.entity';
import { FavoritesService } from './favoriteOffers.service';
import { FavoritesController } from './favoriteOffers.controller';

 @Module({
        imports: [TypeOrmModule.forFeature([FavoriteOffers, User, Offer])],
        providers: [FavoritesService],
        controllers: [FavoritesController],
    
})
export class FavoriteOffersModule {
 

}
