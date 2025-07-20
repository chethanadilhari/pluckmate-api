import { Module } from '@nestjs/common';
import {TaskTemplateController  } from './task-template.controller';
import { TaskTemplateService } from './task-template.service';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [TaskTemplateController],
  providers: [TaskTemplateService, PrismaService],
})
export class TaskTemplateModule {}
