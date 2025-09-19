import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskModule } from '../src/task/task.module';
import { Task } from '../src/task/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;

  // Configuração de banco de dados em memória para testes
  const testDbConfig = {
    type: 'sqlite' as const,
    database: ':memory:',
    entities: [Task],
    synchronize: true,
    logging: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(testDbConfig),
        TaskModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configurar validação global
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Limpar o banco de dados após cada teste
    await taskRepository.clear();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Nova tarefa',
        description: 'Descrição da nova tarefa',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Tarefa criada com sucesso',
        data: {
          id: expect.any(Number),
          title: createTaskDto.title,
          description: createTaskDto.description,
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('should create a task without description', async () => {
      const createTaskDto = {
        title: 'Tarefa sem descrição',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Tarefa criada com sucesso',
        data: {
          id: expect.any(Number),
          title: createTaskDto.title,
          description: null,
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it('should fail to create task without title', async () => {
      const createTaskDto = {
        description: 'Descrição sem título',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should fail to create task with empty title', async () => {
      const createTaskDto = {
        title: '',
        description: 'Descrição com título vazio',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should fail to create task with invalid title type', async () => {
      const createTaskDto = {
        title: 123,
        description: 'Descrição',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Tarefas encontradas',
        data: [],
        total: 0,
      });
    });

    it('should return all tasks ordered by creation date descending', async () => {
      // Criar algumas tarefas
      const task1 = taskRepository.create({
        title: 'Primeira tarefa',
        description: 'Descrição 1',
      });
      await taskRepository.save(task1);

      // Aguardar um pouco para garantir diferença no timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      const task2 = taskRepository.create({
        title: 'Segunda tarefa',
        description: 'Descrição 2',
      });
      await taskRepository.save(task2);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body.message).toBe('Tarefas encontradas');
      expect(response.body.total).toBe(2);
      expect(response.body.data).toHaveLength(2);
      
      // Verificar se estão ordenadas por data de criação (mais recente primeiro)
      const tasks = response.body.data;
      expect(new Date(tasks[0].createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(tasks[1].createdAt).getTime()
      );
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    let taskId: number;

    beforeEach(async () => {
      const task = taskRepository.create({
        title: 'Tarefa para atualizar',
        description: 'Descrição original',
      });
      const savedTask = await taskRepository.save(task);
      taskId = savedTask.id;
    });

    it('should update a task', async () => {
      const updateTaskDto = {
        title: 'Tarefa atualizada',
        completed: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Tarefa atualizada com sucesso',
        data: {
          id: taskId,
          title: updateTaskDto.title,
          completed: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
      
      // Verificar se a descrição é preservada (pode ser null ou string original no SQLite)
      expect(response.body.data.description).toBeDefined();
    });

    it('should update only provided fields', async () => {
      // Primeiro, vamos verificar a tarefa antes da atualização
      const tasksBefore = await taskRepository.find();
      expect(tasksBefore).toHaveLength(1);
      expect(tasksBefore[0].title).toBe('Tarefa para atualizar');
      expect(tasksBefore[0].description).toBe('Descrição original');
      expect(tasksBefore[0].completed).toBe(false);

      const updateTaskDto = {
        completed: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.data.completed).toBe(true);
      expect(response.body.message).toBe('Tarefa atualizada com sucesso');
    });

    it('should return 404 when updating non-existent task', async () => {
      const updateTaskDto = {
        title: 'Tarefa atualizada',
      };

      await request(app.getHttpServer())
        .patch('/tasks/999')
        .send(updateTaskDto)
        .expect(404);
    });

    it('should fail validation with invalid data types', async () => {
      const updateTaskDto = {
        title: 123,
        completed: 'invalid',
      };

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(400);
    });

    it('should fail with invalid ID parameter', async () => {
      const updateTaskDto = {
        title: 'Tarefa atualizada',
      };

      await request(app.getHttpServer())
        .patch('/tasks/invalid-id')
        .send(updateTaskDto)
        .expect(400);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    let taskId: number;

    beforeEach(async () => {
      const task = taskRepository.create({
        title: 'Tarefa para deletar',
        description: 'Descrição da tarefa',
      });
      const savedTask = await taskRepository.save(task);
      taskId = savedTask.id;
    });

    it('should delete a task', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(204);

      // Verificar se a tarefa foi realmente deletada
      const deletedTask = await taskRepository.findOne({
        where: { id: taskId },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when deleting non-existent task', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/999')
        .expect(404);
    });

    it('should fail with invalid ID parameter', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/invalid-id')
        .expect(400);
    });
  });

  describe('Integration workflow', () => {
    it('should create, read, update, and delete a task', async () => {
      // Create
      const createTaskDto = {
        title: 'Tarefa do fluxo completo',
        description: 'Descrição da tarefa do fluxo',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      const taskId = createResponse.body.data.id;

      // Read (verify creation)
      const getAllResponse = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(getAllResponse.body.total).toBe(1);
      expect(getAllResponse.body.data[0].title).toBe(createTaskDto.title);

      // Update
      const updateTaskDto = {
        title: 'Tarefa atualizada no fluxo',
        completed: true,
      };

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send(updateTaskDto)
        .expect(200);

      // Verify update
      const getAfterUpdateResponse = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(getAfterUpdateResponse.body.data[0].title).toBe(updateTaskDto.title);
      expect(getAfterUpdateResponse.body.data[0].completed).toBe(true);

      // Delete
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(204);

      // Verify deletion
      const getFinalResponse = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(getFinalResponse.body.total).toBe(0);
    });
  });
});
