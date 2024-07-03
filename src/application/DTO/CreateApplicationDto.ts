import { IsString, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateApplicationDto {
 

  @IsString()
  @IsNotEmpty()
  resume: string;

  @IsString()
  @IsNotEmpty()
  userId: ObjectId;

  @IsString()
  @IsNotEmpty()
  offerId:  ObjectId;

  @IsString()
  motivationLetter?: string;
}
