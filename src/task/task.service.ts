import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // Unified create method for single and multiple employees
  async createFlexible(dto: CreateTaskDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dto.employeeIds?.length) {
      const tasks = dto.employeeIds.map((employeeId) => ({
        employeeId,
        taskTemplateId: dto.taskTemplateId,
        block: dto.block,
        field: dto.field,
        note: dto.note,
        status: dto.status || 'PENDING',
        date: today,
      }));

      return this.prisma.task.createMany({
        data: tasks,
        skipDuplicates: true,
      });
    }

    if (dto.employeeId) {
      return this.prisma.task.create({
        data: {
          employeeId: dto.employeeId,
          taskTemplateId: dto.taskTemplateId,
          block: dto.block,
          field: dto.field,
          note: dto.note,
          status: dto.status || 'PENDING',
          date: today,
        },
      });
    }

    throw new BadRequestException('You must provide either employeeId or employeeIds');
  }

  async findAll(status?: string) {
    const where = status ? { status: status as TaskStatus } : {};

    return this.prisma.task.findMany({
      where,
      include: {
        employee: true,
        taskTemplate: true,
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { employee: true, taskTemplate: true },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() !== today.getTime()) {
      throw new BadRequestException('Only today’s tasks can be edited');
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');

    await this.prisma.task.delete({ where: { id } });
  }
}
