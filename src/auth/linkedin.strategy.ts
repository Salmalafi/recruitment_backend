import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { AuthService } from './auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: "email profile",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
   
    try {
      const user = await this.authService.validateOAuthLogin(profile, 'linkedin');
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
