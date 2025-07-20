
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import dayjs from 'dayjs'
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Create or update today's attendance
  async markAttendance(dto: CreateAttendanceDto) {
    const today = dayjs().startOf('day').toDate();

    return this.prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: dto.employeeId,
          date: today,
        },
      },
      update: { status: dto.status },
      create: {
        employeeId: dto.employeeId,
        date: today,
        status: dto.status,
      },
    });
  }

  // Update today's attendance explicitly
  async updateAttendance(employeeId: number, status: AttendanceStatus) {
    const today = dayjs().startOf('day').toDate();

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('No attendance found for today to update.');
    }

    return this.prisma.attendance.update({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  async getAttendanceByDate(date: string, name?: string) {
    // const targetDate = new Date(date);
    const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format. Expected format: YYYY-MM-DD');
  }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Fetching attendance for date:', startOfDay, 'to', endOfDay);

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
        { lastName: { contains: name } },
      ],
    };
  }

  return this.prisma.attendance.findMany({
    where,
    include: { employee: true },
    orderBy: { employeeId: 'asc' },
  });
}



}
 
