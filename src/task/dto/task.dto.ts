import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  titile: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  titile?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed deve ser um valor booleano' })
  completed?: boolean;
}
