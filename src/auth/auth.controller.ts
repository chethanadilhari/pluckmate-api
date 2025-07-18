import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: AuthenticatedRequest) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const userId = req.user.id;
    return this.authService.changePassword(userId, dto.oldPassword, dto.newPassword);
  }

 
  @Post('request-reset')
  requestReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}

