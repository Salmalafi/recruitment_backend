/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email, roles: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  

  async validateOAuthLogin(profile: any, provider: string): Promise<any> {
    let user = await this.usersService.findOneByOAuthId(profile.id, provider);

    if (!user) {
      user = await this.usersService.createOAuthUser(profile, provider);
    }

    const payload = { email: user.email, sub: user._id }; // Change 'username' to 'email'
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
