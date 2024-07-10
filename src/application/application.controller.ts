import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, Bind, UseGuards, Res } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Public, Roles } from 'src/auth/auth.controller';
import { CreateApplicationDto } from './DTO/CreateApplicationDto';
import { ApplicationsService } from './application.service';
import { UpdateApplicationDto } from './DTO/CreateApplicationDto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/role.enum';

import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import * as path from 'path';
import { Response } from 'express';


@UseGuards(AuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
 @Roles(Role.Candidate)
  @Post()
  @Bind(UploadedFiles())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'resume', maxCount: 1 },
    { name: 'motivationLetter', maxCount: 1 },
  ]))
  async create(
    @UploadedFiles() files: { resume?: Express.Multer.File[], motivationLetter?: Express.Multer.File[] },
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    if (!files.resume || files.resume.length === 0 || !files.resume[0].filename) {
      throw new BadRequestException('Resume file is missing or has no filename');
    }

    createApplicationDto.resume = files.resume[0].filename; 
    if (files.motivationLetter && files.motivationLetter.length > 0 && files.motivationLetter[0].filename) {
      createApplicationDto.motivationLetter = files.motivationLetter[0].filename;
    }

    createApplicationDto.userId = new ObjectId(createApplicationDto.userId);
    createApplicationDto.offerId = new ObjectId(createApplicationDto.offerId);

    return this.applicationsService.create(createApplicationDto);
  }
  @Roles(Role.Admin, Role.HrAgent)
  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }
  @Roles(Role.Candidate, Role.HrAgent)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      const objectId = new ObjectId(userId); // Convert userId to ObjectId
      return this.applicationsService.findByUserId(objectId);
    } catch (error) {
      console.error('Error converting userId to ObjectId:', error);
      throw error; // Handle or rethrow the error as needed
    }

  }
  @Roles(Role.HrAgent)
  @Get('offer/:offerId')
  findByOfferId(@Param('offerId') offerId: ObjectId) {
    return this.applicationsService.findByOfferId(offerId);
  }
  @Get('resume/:filename')
  getResume(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
    res.sendFile(filePath);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    const objectId = new ObjectId(id);
    return this.applicationsService.findOne(objectId);
  }
  @Public()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('resume'))
  async update(@Param('id') id: string, @UploadedFile() resume: Express.Multer.File, @Body() updateApplicationDto: UpdateApplicationDto) {
    if (resume) {
      updateApplicationDto.resume = resume.filename;
    }
    const objectId = new ObjectId(id);
    return this.applicationsService.update(objectId, updateApplicationDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    const objectId = new ObjectId(id); 
    return this.applicationsService.remove(objectId);
  }
}