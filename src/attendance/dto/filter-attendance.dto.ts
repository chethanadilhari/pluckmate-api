import { IsDateString, IsOptional } from 'class-validator';

export class FilterAttendanceDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
