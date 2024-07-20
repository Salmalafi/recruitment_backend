// offers.module.ts or applications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offer.service'; // Corrected service filename
import { OffersController } from './offer.controller'; // Corrected controller filename
import { Application } from '../application/application.entity'; // Corrected import path
import { Offer } from './offer.entity'; // Assuming Offer entity is defined in offer.entity.ts
import { databaseProviders } from 'src/database/database.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersModule } from 'src/users/users.module';
import { MailerService } from 'src/auth/nodemailer.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Application]),
    TypeOrmModule.forRoot({
        type: 'mongodb',
        url: process.env.MONGODB_CONNECTION_STRING,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
    DatabaseModule,
    UsersModule
  
  ],
  providers: [OffersService,   {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  MailerService],
  controllers: [OffersController],
})
export class OffersModule {}


