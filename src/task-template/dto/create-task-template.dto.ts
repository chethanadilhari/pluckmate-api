import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TaskCategory } from '@prisma/client';

export class CreateTaskTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  fixedPayment: number;

  @IsEnum(TaskCategory)
  category: TaskCategory;
}
