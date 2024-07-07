// mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const mailOptions = {
        from: "noreply@capgeminirecrutement.com", 
      to, 
      subject: 'Password Reset', 
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`, 
      html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
