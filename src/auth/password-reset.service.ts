// auth/password-reset.service.ts

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.entity';
import { MailerService } from './nodemailer.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async createResetToken(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate unique token
    const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

    // Store token directly in user object (you may need to adjust your User entity)
    user.resetPasswordToken = token;

    await this.usersRepository.save(user);

    // Send the reset email
    await this.mailerService.sendPasswordResetEmail(email, token);
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    try {
      const { email } = this.jwtService.verify(token); // Verify and decode JWT token
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user || user.resetPasswordToken !== token) {
        throw new BadRequestException('Invalid token');
      }

      return user;
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findUserByResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null; // Clear reset token after password reset
    await this.usersRepository.save(user);
  }
}
