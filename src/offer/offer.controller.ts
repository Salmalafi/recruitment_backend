import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateOfferDto } from './DTO/createOfferDto';
import { OffersService } from './offer.service';
import { UpdateOfferDto } from './DTO/UpdateOfferDto';
import { Public, Roles } from 'src/auth/auth.controller';
import { ObjectId } from 'mongodb';


import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Roles(Role.HrAgent)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
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
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    const objectId = new ObjectId(id);
    return this.offersService.remove(objectId);
  }
}
