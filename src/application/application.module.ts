import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './application.controller';
import { ApplicationsService } from './application.service';
import { Application } from './application.entity';
import { MailerService } from 'src/auth/nodemailer.service';

import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    MulterModule.register({
      dest: './uploads', 
    }),
    UsersModule,
    HttpModule
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, MailerService],
})
export class ApplicationsModule {}



