import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PrismaService } from './core/services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { HarvestModule } from './harvest/harvest.module';
import { TaskTemplateModule } from './task-template/task-template.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    EmployeeModule, AuthModule, AttendanceModule, HarvestModule, TaskTemplateModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService], 
})
export class AppModule {}
