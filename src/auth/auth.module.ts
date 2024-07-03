/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { usersProviders } from '../users/users.providers';
import { databaseProviders } from 'src/database/database.providers';
import { DatabaseModule } from 'src/database/database.module';
import { LinkedInStrategy } from './linkedin.strategy'; // Add this line

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { LinkedInController } from '../linkedin/linkedin.controller';



dotenvExpand.expand(dotenv.config());
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: "salmaaaaaaaa45789621",
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ...usersProviders,
    ...databaseProviders,
    AuthService,
    LinkedInStrategy, // Add this line
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}


