/*
  Model: Interage diretamente com o banco de dados
  
  Analogia: É a cozinha - onde os dados são realmente manipulados 
*/

// Importa o cliente Prisma configurado (nossa conexão com o banco de dados)
const prisma = require('../config/prisma');
// Importa bcrypt para criptografar senhas (transforma "123456" em "$2a$10$xyz...")
const bcrypt = require('bcryptjs');

// Classe que contém todos os métodos para manipular usuários no banco
class UserModel {
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id } 
    });
  }

  // ============ BUSCAR USUÁRIO POR EMAIL ============
  static async findByEmail(email) {
    // Busca um usuário onde o campo 'email' é igual ao valor passado
    return await prisma.user.findUnique({
      where: { email } 
    });
  }

  // ============ CRIAR NOVO USUÁRIO ============
  static async create(userData) {
    // Destructuring: extrai os campos do objeto userData
    const { name, email, password } = userData;

    // -------- CRIPTOGRAFAR SENHA --------
    // bcrypt.hash = transforma a senha em um hash seguro
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------- SALVAR NO BANCO --------
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword 
      }
    });
  }

  // ============ ATUALIZAR USUÁRIO ============
  static async update(id, userData) {
    return await prisma.user.update({
      where: { id },        
      data: userData        
    });
  }

  // ============ DELETAR USUÁRIO ============
  static async delete(id) {
    return await prisma.user.delete({
      where: { id } 
    });
  }

  // ============ LISTAR TODOS OS USUÁRIOS ============
  static async findAll() {
    return await prisma.user.findMany({
      select: {               
        id: true,             
        name: true,
        email: true,
        createdAt: true
      }
    });
  }

  // ============ VERIFICAR SENHA ============
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;
