/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EnvModule } from './env/env.module';
import { LinkedInModule } from './linkedin/linkedin.module';
import { OffersModule } from './offer/offer.module';
import { ApplicationsModule } from './application/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as express from 'express';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FavoriteOffersModule } from './favorite-offers/favorite-offers.module';
import { MessagesModule } from './messages/messages.module';
@Module({
  imports: [AuthModule, MulterModule.register({
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }), PostModule,UsersModule, EnvModule, LinkedInModule, OffersModule, ApplicationsModule, FavoriteOffersModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
 
})
export class AppModule {

}
