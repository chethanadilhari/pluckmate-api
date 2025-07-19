import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { EmployeeRole } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        ...dto,
        joinedDate: new Date(dto.joinedDate), // Convert string to Date
      },
    });
  }

  async findAll(filter?: { name?: string; role?: EmployeeRole }) {
    const where: any = {};

    if (filter?.name) {
      where.OR = [
        { firstName: { contains: filter.name } },
        { lastName: { contains: filter.name } },
      ];
    }

    if (filter?.role) {
      where.role = filter.role;
    }

    return this.prisma.employee.findMany({ where });
  }

  async findOne(id: number) {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const existing = await this.prisma.employee.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Employee not found');

    if (dto.nic && dto.nic !== existing.nic) {
      const nicExists = await this.prisma.employee.findUnique({ where: { nic: dto.nic } });
      if (nicExists) {
        throw new BadRequestException('NIC already exists for another employee');
      }
    }

    const data: any = { ...dto };
    if (data.joinedDate) {
      data.joinedDate = new Date(data.joinedDate);
    }

    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.employee.delete({ where: { id } });
  }
}
