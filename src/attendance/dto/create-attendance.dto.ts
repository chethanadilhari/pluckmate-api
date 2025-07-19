import { IsEnum, IsInt } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @IsInt()
  employeeId: number;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
