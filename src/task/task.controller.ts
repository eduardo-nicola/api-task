import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto): Promise<{
    message: string;
    data: Task;
  }> {
    const task = await this.taskService.create(createTaskDto);
    return {
      message: 'Tarefa criada com sucesso',
      data: task,
    };
  }

  @Get()
  async findAll(): Promise<{
    message: string;
    data: Task[];
    total: number;
  }> {
    const tasks = await this.taskService.findAll();
    return {
      message: 'Tarefas encontradas',
      data: tasks,
      total: tasks.length,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{
    message: string;
    data: Task;
  }> {
    const task = await this.taskService.update(id, updateTaskDto);
    return {
      message: 'Tarefa atualizada com sucesso',
      data: task,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.taskService.remove(id);
  }
}
