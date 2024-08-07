// mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { User } from 'src/users/users.entity';

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
  async sendNewsletter(users: User[], previewUrl: string) {
    const subscribedUsers = users.filter(user => user.subscribed);

    for (const user of subscribedUsers) {
      const mailOptions = {
        from: "noreply@capgeminirecrutement.com",
        to: user.email,
        subject: 'New Job Offer Available!',
        text: `Dear ${user.firstName || 'Subscriber'},

          We are excited to announce a new job offer is available at our company! Visit our website to view the details and apply: ${previewUrl}

          Best regards,
          Recruitment Team`,
        html: `<p>Dear ${user.firstName || 'Subscriber'},</p>
          <p>We are excited to announce a new job offer is available at our company! Visit our <a href="${previewUrl}">website</a> to view the details and apply.</p>
          <p>Best regards,<br>Recruitment Team</p>`,
      };

      try {
        await this.transporter.sendMail(mailOptions);
        console.log(`Newsletter sent successfully to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send newsletter to ${user.email}:`, error);
      }
    }
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
  async sendApplicationCreatedEmail(to: string) {
    const subject = 'Application Submitted Successfully';
    const text = `Dear Applicant,

      Thank you for submitting your application. Your application is currently pending review by our team. We will notify you once a decision has been made. 

      Best regards,
      Recruitment Team`;
    const html = `<p>${text}</p>`;

    const mailOptions = {
      from: "noreply@capgeminirecrutement.com",
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendStatusUpdateEmail(to: string, status: string) {
    let subject: string;
    let text: string;
    let html: string;

    switch (status) {
      case 'Accepted for 1st Interview':
        subject = 'Congratulations! You Have Been Selected for an Interview';
        text = `Dear Applicant,

          We are pleased to inform you that you have been selected to proceed to the first interview stage. Congratulations! Our team will contact you shortly to schedule an interview. Please prepare accordingly and feel free to reach out if you have any questions.

          Best regards,
          Recruitment Team`;
        break;
      case 'Accepted for In-Depth Interview':
        subject = 'Exciting News! You Have Been Invited for an In-Depth Interview';
        text = `Dear Applicant,

          We have exciting news! You have been selected to proceed to an in-depth interview stage. This is an important step in our selection process, and we look forward to discussing your qualifications further. Our team will reach out to you soon to arrange the details.

          Best regards,
          Recruitment Team`;
        break;
        case 'Declined for next step':
          subject = 'Exciting News! You Have Been Invited for an In-Depth Interview';
          text = `Dear Applicant,
  
            We have exciting news! You have been selected to proceed to an in-depth interview stage. This is an important step in our selection process, and we look forward to discussing your qualifications further. Our team will reach out to you soon to arrange the details.
  
            Best regards,
            Recruitment Team`;
          break;
      case 'hired':
        subject = 'Congratulations! You Have Been Hired';
        text = `Dear Applicant,

          We are thrilled to extend our congratulations on your successful application. You have been hired for the position at [Company Name]. Welcome aboard! Our team will be in touch shortly to discuss the next steps and to help you get started.

          Welcome to the team!

          Best regards,
          Recruitment Team`;
        break;
      case 'refused':
        subject = 'Update on Your Application Status';
        text = `Dear Applicant,

          After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We appreciate the time and effort you invested in the application process and encourage you to apply for future opportunities with us.

          Thank you for your understanding.

          Sincerely,
          Recruitment Team`;
        break;
      default:
        subject = 'Application Status Update';
        text = `Dear Applicant,

          Your application status has been updated to: ${status}. Please log in to your account for more details.

          Best regards,
          Recruitment Team`;
        break;
    }

    const mailOptions = {
      from: "noreply@capgeminirecrutement.com",
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendPasswordChangedEmail(to: string, newPassword: string) {
    const subject = 'Password Change Confirmation';
    const text = `Dear User,

      This is a confirmation that your password has been successfully changed. If you did not request this change, please contact our support team immediately.

      Best regards,
      Recruitment Team`;
    const html = `<p>${text}</p>`;

    const mailOptions = {
      from: "noreply@capgeminirecrutement.com",
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendHrAgentWelcomeEmail(to: string, password: string) {
    const subject = 'Welcome to Our Team!';
    const text = `Dear HrAgent,

      We are excited to welcome you to our team! We look forward to the contributions you will bring and the positive impact you will make.
     You can log in into your account with your emmail and this initial password : ${password}
     We recommend that you update your password soon .
      Best regards,
      Recruitment Team`;
    const html = `<p>${text}</p>`;

    const mailOptions = {
      from: "noreply@capgeminirecrutement.com",
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}


