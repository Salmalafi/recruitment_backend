import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ObjectId } from 'mongodb';
import { CreateOfferDto } from './DTO/createOfferDto';
import { UpdateOfferDto } from './DTO/UpdateOfferDto';
import { Offer } from './offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}

  create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offersRepository.create(createOfferDto);
    return this.offersRepository.save(offer);
  }

  findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  findOne(id: ObjectId): Promise<Offer> {
    return this.offersRepository.findOne({ where: { _id: id } });
  }

  async update(id: ObjectId, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    await this.offersRepository.update(id, updateOfferDto);
    return this.findOne(id);
  }

  async remove(id: ObjectId): Promise<void> {
    await this.offersRepository.delete(id);
  }
}
