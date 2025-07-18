import { IsString, IsEnum, IsDateString } from 'class-validator';
import { EmployeeRole } from '@prisma/client';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nic: string;

  @IsString()
  address: string;

  @IsString()
  phoneNo: string;

  @IsDateString()
  joinedDate: string;

  @IsEnum(EmployeeRole)
  role: EmployeeRole;
}
