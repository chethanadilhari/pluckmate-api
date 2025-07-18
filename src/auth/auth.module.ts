import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaService } from 'src/core/services/prisma.service';
import { MailService } from 'src/core/services/email.service';

@Module({
  imports: [
    PassportModule,
   JwtModule.register({
  secret: process.env.JWT_SECRET || 'my_default_secret', // fallback to avoid crash
  signOptions: { expiresIn: '30d' },
}),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}