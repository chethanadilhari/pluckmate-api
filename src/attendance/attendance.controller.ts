import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { AttendanceStatus } from '@prisma/client';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('mark')
  mark(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }

  @Patch('update-today/:employeeId')
  updateTodayAttendance(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body('status') status: AttendanceStatus
  ) {
    return this.attendanceService.updateAttendance(employeeId, status);
  }

  

  @Get('today')
  getToday() {
    return this.attendanceService.getTodayAttendance();
  }

  @Get('range')
  getByRange(@Query() dto: FilterAttendanceDto) {
    return this.attendanceService.getAttendanceByRange(dto);
  }
}
