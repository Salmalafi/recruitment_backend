import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './application.controller';
import { ApplicationsService } from './application.service';
import { Application } from './application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    MulterModule.register({
      dest: './uploads', 
    }),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}


