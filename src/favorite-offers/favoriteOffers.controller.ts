import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { FavoritesService } from './favoriteOffers.service';
import { ObjectId } from 'mongodb';
import { Public } from 'src/auth/auth.controller';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Public()
  @Post()
  async addFavorite(@Body('userId') userId: string, @Body('offerId') offerId: string) {
    const userObjectId = new ObjectId(userId);
    const offerObjectId = new ObjectId(offerId);
    return this.favoritesService.addFavorite(userObjectId, offerObjectId);
  }

  @Public()
  @Get('user/:userId')
  async findAllFavorites(@Param('userId') userId: string) {
    const userObjectId = new ObjectId(userId);
    return this.favoritesService.findAllFavorites(userObjectId);
  }

  @Public()
  @Get('favorite/:id')
  async findFavoriteById(@Param('id') id: string) {
    const favoriteObjectId = new ObjectId(id);
    return this.favoritesService.findFavoriteById(favoriteObjectId);
  }
  @Public()
  @Delete(':userId/:offerId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('offerId') offerId: string,
  ) {
    const userObjectId = new ObjectId(userId);
    const offerObjectId = new ObjectId(offerId);
    return this.favoritesService.removeFavorite(userObjectId, offerObjectId);
  }
}
