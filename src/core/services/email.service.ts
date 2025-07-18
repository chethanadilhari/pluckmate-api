// src/core/services/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;


  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true, // Use TLS for Gmail
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
}

  async sendResetPasswordMail(to: string, resetLink: string) {
    // await this.transporter.sendMail({
    //   from: `"PluckMate Support" <${process.env.SMTP_USER}>`,
    //   to,
    //   subject: 'Password Reset Request',
    //   html: `
    //     <p>Hi,</p>
    //     <p>You requested to reset your password. Click the link below to reset it:</p>
    //     <a href="${resetLink}">Reset Password</a>
    //     <p>This link will expire in 15 minutes.</p>
    //   `,
    // });

    console.log(`Sending reset password email to ${to} with link: ${resetLink}`);
  }
}
