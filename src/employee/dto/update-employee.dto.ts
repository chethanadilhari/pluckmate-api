import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { EmployeeRole } from '@prisma/client';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nic?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;

  @IsOptional()
  @IsDateString()
  joinedDate?: string; // or Date

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;
}
