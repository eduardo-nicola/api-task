import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Cria uma instância do ConfigService para usar as variáveis de ambiente
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'tasks_db'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  synchronize: false, // Sempre false para migrações
  logging: configService.get('NODE_ENV') === 'development',
});