import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, Bind, UseGuards, Res, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Public, Roles } from 'src/auth/auth.controller';
import { CreateApplicationDto, UpdateApplicationDto } from './DTO/CreateApplicationDto';
import { ApplicationsService } from './application.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { MailerService } from 'src/auth/nodemailer.service';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import axios from 'axios';
import { ApplicationStatus } from './status.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(
   
    private readonly applicationsService: ApplicationsService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService
  ) {}

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
  ) {console.log('Received files:', files);
    if (!files.resume || files.resume.length === 0 || !files.resume[0].filename) {
      throw new BadRequestException('Resume file is missing or has no filename');
    }

    createApplicationDto.resume = files.resume[0].filename;
    if (files.motivationLetter && files.motivationLetter.length > 0 && files.motivationLetter[0].filename) {
      createApplicationDto.motivationLetter = files.motivationLetter[0].filename;
    }

    createApplicationDto.userId = new ObjectId(createApplicationDto.userId);
    createApplicationDto.offerId = new ObjectId(createApplicationDto.offerId);

    const newApplication = await this.applicationsService.create(createApplicationDto);
    try {
      const applicantEmail = await this.usersService.getUserEmailById(createApplicationDto.userId); 

      await this.mailerService.sendApplicationCreatedEmail(applicantEmail);
    } catch (error) {
      console.error('Error sending application created email:', error);

    }

    return newApplication;
  }

  @Roles(Role.HrAgent)
  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Roles(Role.Candidate, Role.HrAgent)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      const objectId = new ObjectId(userId);
      return this.applicationsService.findByUserId(objectId);
    } catch (error) {
      console.error('Error converting userId to ObjectId:', error);
      throw error;
    }
  }

  @Roles(Role.HrAgent)
  @Get('offer/:offerId')
  async findByOfferId(@Param('offerId') offerId: string) {
    try {
      const objectId = new ObjectId(offerId);
      return this.applicationsService.findByOfferId(objectId);
    } catch (error) {
      console.error('Error converting offerId to ObjectId:', error);
      throw new BadRequestException('Invalid Offer ID format');
    }
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

  @Patch(':id')
  @UseInterceptors(FileInterceptor('resume'))
  async update(
    @Param('id') id: string,
    @UploadedFile() resume: Express.Multer.File,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    if (resume) {
      updateApplicationDto.resume = resume.filename;
    }

    const applicationId = new ObjectId(id);
    return this.applicationsService.update(applicationId, updateApplicationDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    const objectId = new ObjectId(id); 
    return this.applicationsService.remove(objectId);
  }

  @Post('process_cvs')
  async processCvs(
    @Body() body: { skills: string[] },
    @Query('offerId') offerId: string
  ): Promise<any> {
    if (!offerId) {
      throw new HttpException('Offer ID is required', HttpStatus.BAD_REQUEST);
    }
  const ObjectOfferid= new ObjectId(offerId);
    // Fetch applications for the specific offer
    const filteredApplications = await this.applicationsService.findByOfferId(ObjectOfferid);
  
    if (filteredApplications.length === 0) {
      throw new HttpException('No applications found for this offer', HttpStatus.NOT_FOUND);
    }
  
    const form = new FormData();
  
    // Append files to FormData
    for (const application of filteredApplications) {
      if (application.resume) {
        const resumePath = path.join(__dirname, '..', '..', 'uploads', application.resume);
        console.log("Here’s resume path:", resumePath);
  
        if (fs.existsSync(resumePath)) {
          try {
            // Append file stream to form data
            form.append('files', fs.createReadStream(resumePath), {
              filename: path.basename(resumePath),
              contentType: 'application/pdf', // Adjust content type if necessary
            });
          } catch (error) {
            console.error(`Error reading file ${resumePath}:`, error.message);
          }
        } else {
          console.error(`File ${resumePath} does not exist`);
        }
      } else {
        console.error('Application resume is undefined or empty');
      }
    }
  
    if (body.skills) {
      form.append('skills', JSON.stringify(body.skills));
    } else {
      throw new HttpException('Skills are required', HttpStatus.BAD_REQUEST);
    }
  
    try {
      const response = await axios.post('http://localhost:8000/rank_cvs/', form, {
        headers: {
          ...form.getHeaders(), // Include headers from form-data
        }
      });
  
      // Handle ranking response
      const rankedCvs = response.data.ranked_cvs;
      
      // Sort applications based on ranking
      const sortedApplications = filteredApplications.map(app => {
        const ranking = rankedCvs.find(rank => rank.path === app.resume);
        return {
          ...app,
          score: ranking ? ranking.score : 0,
        };
      }).sort((a, b) => b.score - a.score); // Sort by score descending
  
      return sortedApplications;
    } catch (error) {
      console.error('Error sending data to FastAPI:', error.message);
      throw new HttpException('Failed to rank applications', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}