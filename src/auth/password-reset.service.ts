// auth/password-reset.service.ts
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.entity';
import { MailerService } from './nodemailer.service';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async createResetToken(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate unique token
    const randomString = randomBytes(20).toString('hex');
    const token = await bcrypt.hash(email + new Date().toISOString() + randomString, 10);
    
    /// Calculate expiration time 1 hour from now
const expirationTime = new Date();
expirationTime.setHours(expirationTime.getHours() + 1); 

user.resetPasswordToken = token;
user.resetPasswordExpires = expirationTime;


    await this.usersRepository.save(user);

    // Send the reset email
    await this.mailerService.sendPasswordResetEmail(email, token);
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()), // Check if token is not expired
      },
    });

    return user;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findUserByResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepository.save(user);
  }
}
