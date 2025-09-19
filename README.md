# Tasks API - NestJS Todo List

Uma API RESTful para gerenciamento de tarefas (todo list) construída com NestJS, TypeScript e MySQL, rodando em ambiente Docker.

## 🐳 Execução com Docker (Recomendado)

### Pré-requisitos
- Docker
- Docker Compose

### Iniciar o ambiente completo
```bash
# Executar script de configuração
./setup-docker.sh

# Ou manualmente:
docker-compose -f docker-compose.dev.yml up --build -d
```

### Comandos úteis Docker
```bash
# Ver logs da aplicação
docker-compose -f docker-compose.dev.yml logs -f api-dev

# Ver logs do banco
docker-compose -f docker-compose.dev.yml logs -f mysql-dev

# Parar containers
docker-compose -f docker-compose.dev.yml down

# Reiniciar com limpeza de volumes
./setup-docker.sh --clean
```

## 🚀 Execução Local (Alternativa)

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+

### Configuração
1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar banco MySQL local:**
   - Crie um banco chamado `tasks_db`
   - Ajuste o arquivo `.env` para conexão local

3. **Iniciar aplicação:**
```bash
npm run start:dev
```

## 📖 Funcionalidades

- ✅ Criar tarefas com título obrigatório
- ✅ Listar todas as tarefas
- ✅ Atualizar tarefas existentes
- ✅ Deletar tarefas
- ✅ Validação de dados
- ✅ Tratamento de erros com mensagens claras
- ✅ TypeORM para integração com MySQL
- ✅ Ambiente Docker completo

## 🔗 Endpoints da API

### POST /tasks
Cria uma nova tarefa
```json
{
  "title": "Título da tarefa (obrigatório)",
  "description": "Descrição opcional"
}
```

### GET /tasks
Lista todas as tarefas

### PATCH /tasks/:id
Atualiza uma tarefa existente
```json
{
  "title": "Novo título (opcional)",
  "description": "Nova descrição (opcional)",
  "completed": true
}
```

### DELETE /tasks/:id
Remove uma tarefa

## 🧪 Testando a API

Use o arquivo `api-examples.http` para testar os endpoints:
- Instale a extensão "REST Client" no VS Code
- Abra o arquivo `api-examples.http`
- Clique em "Send Request" em cada exemplo

## ⚙️ Configuração de Ambiente

### Docker (Desenvolvimento)
```env
DB_HOST=mysql-dev
DB_PORT=3306
DB_USERNAME=taskuser
DB_PASSWORD=taskpassword
DB_NAME=tasks_db
```

### Local
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_NAME=tasks_db
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod

# Build
npm run build

# Testes
npm run test
```

## Estrutura do Projeto

```
src/
├── config/
│   └── database.config.ts    # Configuração do banco
├── filters/
│   └── global-exception.filter.ts  # Tratamento global de erros
├── task/
│   ├── dto/
│   │   └── task.dto.ts       # DTOs de validação
│   ├── task.controller.ts    # Controlador das rotas
│   ├── task.entity.ts        # Entidade do banco
│   ├── task.module.ts        # Módulo das tarefas
│   └── task.service.ts       # Lógica de negócio
├── app.module.ts             # Módulo principal
└── main.ts                   # Ponto de entrada
```

## Tratamento de Erros

A API retorna mensagens de erro claras em português:

- **400 Bad Request:** Dados de entrada inválidos
- **404 Not Found:** Tarefa não encontrada
- **500 Internal Server Error:** Erro interno do servidor

Exemplo de resposta de erro:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "O título é obrigatório",
  "errors": ["O título é obrigatório"],
  "timestamp": "2025-09-18T10:30:00.000Z"
}
```
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
