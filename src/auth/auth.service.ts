
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/core/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...rest } = user;
    return rest;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async changePassword(userId: string,oldPassword:string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async requestPasswordReset(email: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) throw new BadRequestException('Email not found');

  const token = this.jwtService.sign(
    { sub: user.id },
    {
      secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
      expiresIn: '15m',
    }
  );

  const resetLink = `${process.env.FRONTEND_RESET_URL}?token=${token}`;

  await this.mailService.sendResetPasswordMail(user.email, resetLink);

  return { message: 'Reset link sent to email' };
}


  async resetPassword(token: string, newPassword: string) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: decoded.sub },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successful' };
  }
}

