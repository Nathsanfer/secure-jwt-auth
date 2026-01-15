/*
  Config: Arquivos de configuração e inicialização
  
  Analogia: É a infraestrutura do restaurante - fornecimento de água, luz, gás
*/

const { PrismaClient } = require('@prisma/client');

// ============ CRIAÇÃO DA INSTÂNCIA ============
const prisma = new PrismaClient();

// ============ EXPORTAÇÃO ============
module.exports = prisma;