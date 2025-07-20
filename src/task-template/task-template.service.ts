import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { TaskCategory } from '@prisma/client';

@Injectable()
export class TaskTemplateService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskTemplateDto) {
    return this.prisma.taskTemplate.create({ data: dto });
  }

  async findAll(filter?: { name?: string; category?: TaskCategory }) {
    const where: any = {};

    if (filter?.name) {
      where.name = { contains: filter.name };
    }

    if (filter?.category) {
      where.category = filter.category;
    }

    return this.prisma.taskTemplate.findMany({ where });
  }

  async findOne(id: number) {
    return this.prisma.taskTemplate.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, dto: UpdateTaskTemplateDto) {
    const existing = await this.prisma.taskTemplate.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task Template not found');

    return this.prisma.taskTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.taskTemplate.delete({ where: { id } });
  }
}
