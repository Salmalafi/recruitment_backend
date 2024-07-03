/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  SetMetadata,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Public } from 'src/auth/auth.controller';




@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post('create')
  create(@Body() newUser: User): Promise<User> {
    return this.usersService.create(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
