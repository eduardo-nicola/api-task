import { validate } from 'class-validator';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

describe('Task DTOs', () => {
  describe('CreateTaskDto', () => {
    it('should validate a valid CreateTaskDto with title and description', async () => {
      const dto = new CreateTaskDto();
      dto.title = 'Tarefa válida';
      dto.description = 'Descrição da tarefa';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate a valid CreateTaskDto with title only', async () => {
      const dto = new CreateTaskDto();
      dto.title = 'Tarefa válida';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when title is empty', async () => {
      const dto = new CreateTaskDto();
      dto.title = '';
      dto.description = 'Descrição da tarefa';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when title is missing', async () => {
      const dto = new CreateTaskDto();
      dto.description = 'Descrição da tarefa';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation when title is not a string', async () => {
      const dto = new CreateTaskDto();
      dto.title = 123 as any;
      dto.description = 'Descrição da tarefa';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when description is not a string', async () => {
      const dto = new CreateTaskDto();
      dto.title = 'Tarefa válida';
      dto.description = 123 as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('UpdateTaskDto', () => {
    it('should validate a valid UpdateTaskDto with all fields', async () => {
      const dto = new UpdateTaskDto();
      dto.title = 'Tarefa atualizada';
      dto.description = 'Descrição atualizada';
      dto.completed = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate a valid UpdateTaskDto with title only', async () => {
      const dto = new UpdateTaskDto();
      dto.title = 'Tarefa atualizada';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate a valid UpdateTaskDto with description only', async () => {
      const dto = new UpdateTaskDto();
      dto.description = 'Descrição atualizada';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate a valid UpdateTaskDto with completed only', async () => {
      const dto = new UpdateTaskDto();
      dto.completed = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate an empty UpdateTaskDto', async () => {
      const dto = new UpdateTaskDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when title is not a string', async () => {
      const dto = new UpdateTaskDto();
      dto.title = 123 as any;
      dto.description = 'Descrição atualizada';
      dto.completed = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when description is not a string', async () => {
      const dto = new UpdateTaskDto();
      dto.title = 'Tarefa atualizada';
      dto.description = 123 as any;
      dto.completed = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail validation when completed is not a boolean', async () => {
      const dto = new UpdateTaskDto();
      dto.title = 'Tarefa atualizada';
      dto.description = 'Descrição atualizada';
      dto.completed = 'true' as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('completed');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should allow empty string for optional title', async () => {
      const dto = new UpdateTaskDto();
      dto.title = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should allow empty string for optional description', async () => {
      const dto = new UpdateTaskDto();
      dto.description = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
