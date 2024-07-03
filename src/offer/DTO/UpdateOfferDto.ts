// src/offers/dto/update-offer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './createOfferDto';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
