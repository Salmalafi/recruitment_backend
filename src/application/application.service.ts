import { BadRequestException, Injectable } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './DTO/CreateApplicationDto';
import { UpdateApplicationDto } from './DTO/UpdateApplicationDto';
import * as Grid from 'gridfs-stream';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const newApplication = this.applicationRepository.create({
      ...createApplicationDto,
    });
    return await this.applicationRepository.save(newApplication);
  }
  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findByUserId(userId: ObjectId): Promise<Application[]> {
    return this.applicationRepository.find({ where: { userId: userId } });
  }
  async findByOfferId(offerId: ObjectId): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { offerId: offerId },
    });
  }

  async findOne(id: ObjectId): Promise<Application> {
    return this.applicationRepository.findOne({ where: { _id: id } });
  }

  async update(id: ObjectId, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    await this.applicationRepository.update(id, updateApplicationDto);
    return this.applicationRepository.findOne({ where: { _id: id } });
  }

  async remove(id: ObjectId): Promise<void> {
    await this.applicationRepository.delete(id);
  }
}