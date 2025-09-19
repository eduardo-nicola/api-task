import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockTask: Task = {
    id: 1,
    title: 'Tarefa teste',
    description: 'Descrição da tarefa teste',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Tarefa teste',
        description: 'Descrição da tarefa teste',
      };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
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

      mockRepository.create.mockReturnValue(taskWithoutDescription);
      mockRepository.save.mockResolvedValue(taskWithoutDescription);

      const result = await service.create(createTaskDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(taskWithoutDescription);
      expect(result).toEqual(taskWithoutDescription);
    });
  });

  describe('findAll', () => {
    it('should return all tasks ordered by creation date descending', async () => {
      const tasks = [mockTask];
      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(tasks);
    });

    it('should return empty array when no tasks exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Tarefa com ID 999 não encontrada'),
      );
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

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockTask,
        ...updateTaskDto,
      });
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when trying to update non-existent task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Tarefa atualizada',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateTaskDto)).rejects.toThrow(
        new NotFoundException('Tarefa com ID 999 não encontrada'),
      );
    });

    it('should update only provided fields', async () => {
      const updateTaskDto: UpdateTaskDto = {
        completed: true,
      };

      const updatedTask = {
        ...mockTask,
        completed: true,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockTask,
        completed: true,
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException when trying to remove non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Tarefa com ID 999 não encontrada'),
      );
    });
  });
});
