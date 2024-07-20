import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { FavoriteOffers } from './favoriteOffers.entity';
import { Offer } from 'src/offer/offer.entity';
import { User } from 'src/users/users.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteOffers)
    private readonly favoritesRepository: Repository<FavoriteOffers>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}

  async addFavorite(userId: ObjectId, offerId: ObjectId): Promise<FavoriteOffers> {
    const user = await this.usersRepository.findOne({ where: { _id: userId } });
    const offer = await this.offersRepository.findOne({ where: { _id: offerId } });
    
    if (!user || !offer) {
      throw new NotFoundException('User or Offer not found');
    }

    const favorite = this.favoritesRepository.create({ 
      userId, 
      offerId 
    });
    return this.favoritesRepository.save(favorite);
  }

  async findAllFavorites(userId: ObjectId): Promise<FavoriteOffers[]> {
    try {
      const user = await this.usersRepository.findOne({ where: { _id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.favoritesRepository.find({
        where: { userId },
        relations: ['user', 'offer'],
      });
    } catch (error) {
      throw new Error('Error fetching favorite offers: ' + error.message);
    }
  }

  async findFavoriteById(favoriteId: ObjectId): Promise<FavoriteOffers> {
    const favorite = await this.favoritesRepository.findOne({ 
      where: { _id: favoriteId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite offer not found');
    }

    return favorite;
  }

  async removeFavorite(userId: ObjectId, offerId: ObjectId): Promise<void> {
    const result = await this.favoritesRepository.delete({ userId, offerId });

    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }
  }
}
