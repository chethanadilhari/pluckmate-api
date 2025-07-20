import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import dayjs from 'dayjs';

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  async markHarvest(dto: CreateHarvestDto) {
    const today = dayjs().startOf('day').toDate();

    return this.prisma.harvest.upsert({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date: today,
        },
      },
      update: { amountKg: dto.amountKg },
      create: {
        employeeId: dto.employeeId,
        amountKg: dto.amountKg,
        date: today,
      },
    });
  }

  async updateHarvest(employeeId: number, amountKg: number) {
    const today = dayjs().startOf('day').toDate();

    const harvest = await this.prisma.harvest.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!harvest) {
      throw new NotFoundException('No harvest record found for today.');
    }

    return this.prisma.harvest.update({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      data: {
        amountKg,
        updatedAt: new Date(),
      },
    });
  }

  async getHarvestByDate(date: string, name?: string) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format. Expected format: YYYY-MM-DD');
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (name) {
      where.employee = {
        OR: [
          { firstName: { contains: name } },
          { lastName: { contains: name} },
        ],
      };
    }

    return this.prisma.harvest.findMany({
      where,
      include: { employee: true },
      orderBy: { employeeId: 'asc' },
    });
  }
}
