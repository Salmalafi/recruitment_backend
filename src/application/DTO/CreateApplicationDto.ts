import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ApplicationStatus } from '../status.enum';

export class CreateApplicationDto {
  resume: string;
  date: Date;
  userId: ObjectId;
  offerId: ObjectId;
  motivationLetter?: string;

  status: ApplicationStatus = ApplicationStatus.PENDING;
}

export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  resume?: string;

  @IsOptional()
  userId?: ObjectId;

  @IsOptional()
  offerId?: ObjectId;

  @IsString()
  @IsOptional()
  motivationLetter?: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
