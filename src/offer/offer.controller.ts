import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateOfferDto } from './DTO/createOfferDto';
import { OffersService } from './offer.service';
import { UpdateOfferDto } from './DTO/UpdateOfferDto';
import { Public } from 'src/auth/auth.controller';
import { ObjectId } from 'mongodb';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Public()
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

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    const objectId = new ObjectId(id);
    return this.offersService.update(objectId, updateOfferDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    const objectId = new ObjectId(id);
    return this.offersService.remove(objectId);
  }
}
