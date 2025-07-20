import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Unified Create - Single or Multiple
  @Post()
  create(@Body() dto: CreateTaskDto) {
    if (!dto.employeeId && (!dto.employeeIds || dto.employeeIds.length === 0)) {
      throw new BadRequestException('You must provide either employeeId or employeeIds');
    }
    return this.taskService.createFlexible(dto);
  }

  // Get All Tasks (Optional Status Filter)
  @Get('all')
  findAll(@Query('status') status?: string) {
    return this.taskService.findAll(status);
  }

  // Get Task by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  // Update Task (Only today's task allowed)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(+id, dto);
  }

  // Delete Task
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }
}
