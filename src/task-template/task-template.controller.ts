import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Body,
} from '@nestjs/common';

import { TaskTemplateService } from './task-template.service';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { TaskCategory } from '@prisma/client';

@Controller('task-templates')
export class TaskTemplateController {
  constructor(private readonly taskTemplateService: TaskTemplateService) {}

  @Post('new')
  create(@Body() createDto: CreateTaskTemplateDto) {
    return this.taskTemplateService.create(createDto);
  }

  @Get('all')
  findAll(
    @Query('name') name?: string,
    @Query('category') category?: TaskCategory,
  ) {
    return this.taskTemplateService.findAll({ name, category });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTaskTemplateDto,
  ) {
    return this.taskTemplateService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskTemplateService.remove(id);
  }
}
