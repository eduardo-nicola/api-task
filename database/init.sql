-- Script para inicialização do banco MySQL no Docker
-- Este script é executado automaticamente quando o container MySQL inicia

-- Criar usuário e conceder permissões
CREATE USER IF NOT EXISTS 'taskuser'@'%' IDENTIFIED BY 'taskpassword';
GRANT ALL PRIVILEGES ON tasks_db.* TO 'taskuser'@'%';
