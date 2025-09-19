# Makefile para Tasks API
.PHONY: setup up down logs clean migrate migrate-revert generate-migration help

# Cores para output
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

DOCKER_COMPOSE_FILE=docker-compose.dev.yml
CONTAINER_NAME=tasks-api-dev


setup:
	@echo "$(GREEN)🚀 Iniciando setup completo do projeto...$(NC)"
	@$(MAKE) up
	@echo "$(YELLOW)⏳ Aguardando containers iniciarem...$(NC)"
	@sleep 10
	@$(MAKE) migrate
	@echo "$(GREEN)✅ Setup concluído! API disponível em http://localhost:3000$(NC)"

up:
	@echo "$(GREEN)🐳 Subindo containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d --build

down:
	@echo "$(YELLOW)🛑 Parando containers...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down

# Ver logs
logs:
	@echo "$(GREEN)📋 Mostrando logs da aplicação...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f api-dev

logs-db:
	@echo "$(GREEN)📋 Mostrando logs do banco de dados...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f mysql-dev

clean:
	@echo "$(YELLOW)🧹 Limpando containers e volumes...$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker system prune -f


migrate:
	@echo "$(GREEN)🗄️ Executando migrações...$(NC)"
	docker exec -it $(CONTAINER_NAME) pnpm run migration:run

migrate-revert:
	@echo "$(YELLOW)↩️ Revertendo última migração...$(NC)"
	docker exec -it $(CONTAINER_NAME) pnpm run migration:revert

# Gerar nova migração
# Uso: make generate-migration NAME=NomeDaMigracao
generate-migration:
	@if [ -z "$(NAME)" ]; then \
		echo "$(YELLOW)❌ Erro: NAME é obrigatório. Use: make generate-migration NAME=NomeDaMigracao$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)📝 Gerando migração: $(NAME)...$(NC)"
	docker exec -it $(CONTAINER_NAME) npx typeorm-ts-node-commonjs migration:generate src/migrations/$(NAME) -d src/config/data-source.ts


shell:
	@echo "$(GREEN)🐚 Acessando shell do container...$(NC)"
	docker exec -it $(CONTAINER_NAME) bash

install:
	@echo "$(GREEN)📦 Instalando dependências...$(NC)"
	docker exec -it $(CONTAINER_NAME) pnpm install

test:
	@echo "$(GREEN)🧪 Executando testes...$(NC)"
	docker exec -it $(CONTAINER_NAME) pnpm test

status:
	@echo "$(GREEN)📊 Status dos containers:$(NC)"
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

restart:
	@echo "$(YELLOW)🔄 Reiniciando aplicação...$(NC)"
	@$(MAKE) down
	@$(MAKE) up

# Help
help:
	@echo "$(GREEN)Tasks API - Makefile Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos principais:$(NC)"
	@echo "  setup              - Setup completo (containers + migrações)"
	@echo "  up                 - Subir containers"
	@echo "  down               - Parar containers"
	@echo "  logs               - Ver logs da aplicação"
	@echo "  logs-db            - Ver logs do banco"
	@echo "  clean              - Limpar containers e volumes"
	@echo ""
	@echo "$(YELLOW)Migrações:$(NC)"
	@echo "  migrate            - Executar migrações"
	@echo "  migrate-revert     - Reverter última migração"
	@echo "  generate-migration - Gerar nova migração (NAME=NomeDaMigracao)"
	@echo ""
	@echo "$(YELLOW)Desenvolvimento:$(NC)"
	@echo "  shell              - Acessar shell do container"
	@echo "  install            - Instalar dependências"
	@echo "  test               - Executar testes"
	@echo "  status             - Ver status dos containers"
	@echo "  restart            - Reiniciar aplicação"
	@echo "  help               - Mostrar esta ajuda"
	@echo ""
	@echo "$(GREEN)Para começar rapidamente, execute: make setup$(NC)"

# Default target
.DEFAULT_GOAL := help
