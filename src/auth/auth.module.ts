/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { usersProviders } from '../users/users.providers';
import { databaseProviders } from 'src/database/database.providers';
import { DatabaseModule } from 'src/database/database.module';
import { LinkedInStrategy } from './linkedin.strategy';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { RolesGuard } from './roles.guard';
import { PasswordResetService } from './password-reset.service';
import { MailerService } from './nodemailer.service';
import { PasswordResetController } from './PasswordReset.controller';

dotenvExpand.expand(dotenv.config());

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY, 
      signOptions: { expiresIn: '36000s' },
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    LinkedInStrategy,
    PasswordResetService, MailerService
  ],
  controllers: [AuthController,PasswordResetController],
  exports: [AuthService, LinkedInStrategy],
})
export class AuthModule {}



