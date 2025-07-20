import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@Controller('harvest')
export class HarvestController {
  constructor(private harvestService: HarvestService) {}

  @Post('mark')
  mark(@Body() dto: CreateHarvestDto) {
    return this.harvestService.markHarvest(dto);
  }

  @Patch('update-today/:employeeId')
  updateTodayHarvest(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body('amountKg') amountKg: number
  ) {
    return this.harvestService.updateHarvest(employeeId, amountKg);
  }

  @Get()
  getHarvestByDate(
    @Query('date') date: string,
    @Query('name') name?: string
  ) {
    return this.harvestService.getHarvestByDate(date, name);
  }
}
