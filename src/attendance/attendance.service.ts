
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
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

  // Get all attendance for today
  async getTodayAttendance() {
    const today = dayjs().startOf('day').toDate();

    return this.prisma.attendance.findMany({
      where: { date: today },
      include: { employee: true },
    });
  }

  // Filter attendance by date range
  async getAttendanceByRange(dto: FilterAttendanceDto) {
    return this.prisma.attendance.findMany({
      where: {
        date: {
          gte: dto.from ? new Date(dto.from) : undefined,
          lte: dto.to ? new Date(dto.to) : undefined,
        },
      },
      include: { employee: true },
      orderBy: { date: 'desc' },
    });
  }
}
