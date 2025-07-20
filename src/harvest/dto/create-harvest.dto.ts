import { IsInt, IsNumber } from 'class-validator';

export class CreateHarvestDto {
  @IsInt()
  employeeId: number;

  @IsNumber()
  amountKg: number;
}