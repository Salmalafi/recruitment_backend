// src/offers/dto/create-offer.dto.ts
import { IsString, IsDate, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  contractType: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDate()
  @IsNotEmpty()
  maxDate: Date;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  profilCherche: string;

  @IsString()
  @IsNotEmpty()
  whatWeOffer: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skillsRequired: string[]; 

  @IsString()
  @IsNotEmpty()
  experience: string;
  
  @IsString()
  @IsNotEmpty()
  rythme: string;
}
