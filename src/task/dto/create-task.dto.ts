import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ValidateIf,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ValidateIf(o => !o.employeeId)
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  employeeIds?: number[];

  @ValidateIf(o => !o.employeeIds)
  @IsInt()
  employeeId?: number;

  @IsInt()
  taskTemplateId: number;

  @IsString()
  block: string;

  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
