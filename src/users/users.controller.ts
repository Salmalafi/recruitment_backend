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
  UseGuards,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Public, Roles } from 'src/auth/auth.controller';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.enum';



@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post('create')
  create(@Body() newUser: User): Promise<User> {
    return this.usersService.create(newUser);
  }
  @Roles(Role.Admin)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id); 
  }
  
  @Public()
  @Post('findByEmail')
  async findByEmail(@Body('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
