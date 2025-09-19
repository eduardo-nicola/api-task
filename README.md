# Tasks API - NestJS

Uma API RESTful para gerenciamento de tarefas construída com NestJS, TypeScript, MySQL e Docker.

## � Como rodar o projeto

### Opção 1: Usando Make (Recomendado)
```bash
# Roda o projeto completo (Docker + Migrações)
make setup

# Ou para parar os containers
make down

# Para ver os logs
make logs
```

### Opção 2: Comandos manuais
```bash
# 1. Subir os containers
docker compose -f docker-compose.dev.yml up -d --build

# 2. Executar as migrações
pnpm db:migrate
```

## � Pré-requisitos

- Docker
- Docker Compose
- Make (opcional, mas recomendado)


### DELETE /tasks/:id
Remove uma tarefa

## 🛠 Comandos úteis

```bash
# Ver logs da aplicação
make logs

# Parar os containers
make down

# Limpar containers e volumes
make clean

# Executar migrações manualmente
make migrate

# Reverter migrações
make migrate-revert

# Gerar nova migração (substitua NOME pela sua migração)
make generate-migration NAME=NomeDaSuaMigracao
```

## 📁 Estrutura do projeto

```
src/
├── config/                          # Configurações do sistema
│   ├── data-source.ts              # Configuração do TypeORM
│   └── database.config.ts          # Config do banco de dados
├── migrations/                      # Migrações do TypeORM
│   └── 
├── task/                           # Módulo de tarefas
│   ├── dto/                        # Data Transfer Objects
│   │   └── task.dto.ts            # DTOs de validação das tarefas
│   ├── task.controller.ts         # Controlador das rotas
│   ├── task.entity.ts             # Entidade do banco de dados
│   ├── task.module.ts             # Módulo NestJS das tarefas
│   └── task.service.ts            # Lógica de negócio
├── filters/                        # Filtros de exceção
│   └── global-exception.filter.ts # Tratamento global de erros
├── app/                           # Módulo principal da aplicação
│   ├── app.controller.spec.ts     # Testes do controlador
│   ├── app.controller.ts          # Controlador principal
│   ├── app.module.ts              # Módulo raiz da aplicação
│   └── app.service.ts             # Serviço principal
└── main.ts                        # Ponto de entrada da aplicação
```

## 🔧 Configuração

O projeto usa variáveis de ambiente definidas no arquivo `.env`. As principais configurações são:

- **DB_HOST**: mysql-dev (nome do container MySQL)
- **DB_PORT**: 3306
- **DB_USERNAME**: taskuser
- **DB_PASSWORD**: taskpassword
- **DB_NAME**: tasks_db
