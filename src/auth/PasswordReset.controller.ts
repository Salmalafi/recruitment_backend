import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PasswordResetService } from 'src/auth/password-reset.service';
import { CreateResetTokenDto, ResetPasswordDto } from '../application/DTO/create-reset-token.dto';
import { Public } from './auth.controller';

@Controller('auth')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}
@Public()
  @Post('password-reset/request')
  async requestPasswordReset(@Body() createResetTokenDto: CreateResetTokenDto): Promise<void> {
    const { email } = createResetTokenDto;
    await this.passwordResetService.createResetToken(email);
  }
  @Public()
  @Post('password-reset/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;
    await this.passwordResetService.resetPassword(token, newPassword);
  }
}
