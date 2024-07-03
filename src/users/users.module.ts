/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...usersProviders,
    UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
