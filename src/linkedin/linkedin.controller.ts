import { Body, Controller, Post } from '@nestjs/common';
import { LinkedInUserProfileObject } from 'src/objects/user-object';
import { LinkedInUserTokenObject } from 'src/objects/user-token';
import { LinkedInService } from './linkedin.service';
import { Public } from 'src/auth/auth.controller';



@Controller('linkedin')
export class LinkedInController {
  constructor(private readonly linkedInService: LinkedInService) {}
@Public()
  @Post('auth/login')
  async login(@Body('authorization_code') authorizationCode: string): Promise<any> {
    const token: LinkedInUserTokenObject = 
        await this.linkedInService.login(authorizationCode);
    const profile: LinkedInUserProfileObject = 
        await this.linkedInService.getProfile(token.accessToken); 
    return profile;
  }

}