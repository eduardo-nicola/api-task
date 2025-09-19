import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTask: Task = {
    id: 1,
    title: 'Tarefa teste',
    description: 'Descrição da tarefa teste',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa teste',
        description: 'Descrição da tarefa teste',
      };

      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual({
        message: 'Tarefa criada com sucesso',
        data: mockTask,
      });
    });

    it('should create a task without description', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa sem descrição',
      };

      const taskWithoutDescription = {
        ...mockTask,
        title: 'Tarefa sem descrição',
        description: null,
      };

      mockTaskService.create.mockResolvedValue(taskWithoutDescription);

      const result = await controller.create(createTaskDto);

      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual({
        message: 'Tarefa criada com sucesso',
        data: taskWithoutDescription,
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [mockTask];
      mockTaskService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(mockTaskService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Tarefas encontradas',
        data: tasks,
        total: tasks.length,
      });
    });

    it('should return empty array when no tasks exist', async () => {
      const tasks: Task[] = [];
      mockTaskService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(mockTaskService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Tarefas encontradas',
        data: tasks,
        total: 0,
      });
    });

    it('should return multiple tasks with correct total count', async () => {
      const tasks = [
        mockTask,
        { ...mockTask, id: 2, title: 'Segunda tarefa' },
        { ...mockTask, id: 3, title: 'Terceira tarefa' },
      ];
      mockTaskService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(mockTaskService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Tarefas encontradas',
        data: tasks,
        total: 3,
      });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa atualizada',
        completed: true,
      };

      const updatedTask = {
        ...mockTask,
        title: 'Tarefa atualizada',
        completed: true,
      };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(1, updateTaskDto);

      expect(mockTaskService.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toEqual({
        message: 'Tarefa atualizada com sucesso',
        data: updatedTask,
      });
    });

    it('should update only provided fields', async () => {
      const updateTaskDto: UpdateTaskDto = {
        completed: true,
      };

      const updatedTask = {
        ...mockTask,
        completed: true,
      };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(1, updateTaskDto);

      expect(mockTaskService.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toEqual({
        message: 'Tarefa atualizada com sucesso',
        data: updatedTask,
      });
    });

    it('should throw NotFoundException when trying to update non-existent task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa atualizada',
      };

      mockTaskService.update.mockRejectedValue(
        new NotFoundException('Tarefa com ID 999 não encontrada'),
      );

      await expect(controller.update(999, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockTaskService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when trying to remove non-existent task', async () => {
      mockTaskService.remove.mockRejectedValue(
        new NotFoundException('Tarefa com ID 999 não encontrada'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
