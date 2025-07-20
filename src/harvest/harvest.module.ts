import { Module } from '@nestjs/common';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [HarvestController],
  providers: [HarvestService, PrismaService],
})
export class HarvestModule {}
