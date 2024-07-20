import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateOfferDto } from './DTO/createOfferDto';
import { OffersService } from './offer.service';
import { UpdateOfferDto } from './DTO/UpdateOfferDto';
import { Public, Roles } from 'src/auth/auth.controller';
import { ObjectId } from 'mongodb';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service'; 
import { MailerService } from 'src/auth/nodemailer.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService 
  ) {}

  @Public()
  //@Roles(Role.HrAgent)
  @Post()
  async create(@Body() offerDto: CreateOfferDto) { 
    const newOffer = await this.offersService.create(offerDto); 
    const users = await this.usersService.findAll(); 

    const previewUrl = 'https://localhost:5173/'; 

    await this.mailerService.sendNewsletter(users, previewUrl)

    return newOffer;
  }

  @Public()
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const objectId = new ObjectId(id);
    return this.offersService.findOne(objectId);
  }

  @Roles(Role.HrAgent)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    const objectId = new ObjectId(id);
    return this.offersService.update(objectId, updateOfferDto);
  }

  @Roles(Role.HrAgent)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const objectId = new ObjectId(id);
    return this.offersService.remove(objectId);
  }
}
