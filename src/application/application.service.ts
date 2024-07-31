import { BadRequestException, Injectable } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './DTO/CreateApplicationDto';
import { UpdateApplicationDto } from './DTO/CreateApplicationDto';
import * as Grid from 'gridfs-stream';
import { MailerService } from 'src/auth/nodemailer.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const { resume, date, userId, offerId, motivationLetter, status } = createApplicationDto;

    const newApplication = new Application();
    newApplication.resume = resume;
    newApplication.date = date;
    newApplication.userId = userId;
    newApplication.offerId = offerId;
    newApplication.motivationLetter = motivationLetter;
    newApplication.status = status;

    return await this.applicationRepository.save(newApplication);
  }
  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findByUserId(userId: ObjectId): Promise<Application[]> {
    return this.applicationRepository.find({ where: {userId: userId} });
  }
  async findByOfferId(offerId: ObjectId): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { offerId: offerId },
    });
  }
  async find(query: any): Promise<Application[]> {
    return this.applicationRepository.find(query);
  }
  async findOne(id: ObjectId): Promise<Application> {
    return this.applicationRepository.findOne({ where: { _id: id } });
  }
  async update(id: ObjectId, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    await this.applicationRepository.update(id, updateApplicationDto);
    const updatedApplication = await this.applicationRepository.findOne({ where: { _id: id } });
    if (updateApplicationDto.status) {
      const applicantId = updatedApplication.userId; 
      const applicantEmail = await this.userService.getUserEmailById(applicantId);
      await this.mailerService.sendStatusUpdateEmail(applicantEmail, updateApplicationDto.status);
    }

    return updatedApplication;
  }
  async remove(id: ObjectId): Promise<void> {
    await this.applicationRepository.delete(id);
  }
}