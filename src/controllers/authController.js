/*
  Controller: Processa a lógica de negócio da aplicação
  
  Analogia: É o garçom - recebe seu pedido, coordena tudo e traz a resposta
*/

// Biblioteca para criar e verificar tokens JWT (convites digitais)
const jwt = require('jsonwebtoken');
// Model para interagir com a tabela de usuários no banco de dados
const UserModel = require('../models/userModel');

// ============ FUNÇÃO AUXILIAR: GERAR TOKEN JWT ============
// É como gerar uma senha temporária que expira em X horas
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                        // Dados que vão dentro do token
    process.env.JWT_SECRET,                // Chave secreta para assinar
    { expiresIn: process.env.JWT_EXPIRES_IN } // Tempo de validade (ex: 7d = 7 dias)
  );
};

// ============ ENDPOINT: REGISTRAR NOVO USUÁRIO ============
exports.register = async (req, res) => {
  try {
    // Extrai os dados enviados no corpo da requisição
    const { email, password, name } = req.body;

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      }); 
    }

    // Busca no banco de dados se já existe um usuário com esse email
    const userExists = await UserModel.findByEmail(email);

    // Se encontrou, retorna erro (não pode ter emails duplicados)
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // -------- CRIAR USUÁRIO --------
    // Salva o novo usuário no banco de dados
    const user = await UserModel.create({
      email,
      password,
      name
    });

    // -------- GERAR TOKEN --------
    // Cria um token JWT para o usuário recém-criado
    const token = generateToken(user.id);

    // -------- RETORNAR SUCESSO --------
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token // Token para o usuário fazer requisições autenticadas
      }
    });

  } catch (error) {
    // Retorna erro
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
};

// ============ ENDPOINT: LOGIN DE USUÁRIO ============
exports.login = async (req, res) => {
  try {
    // Extrai email e senha do corpo da requisição
    const { email, password } = req.body;

    // Verifica campos obrigatórios 
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // -------- BUSCAR USUÁRIO --------
    // Procura no banco um usuário com esse email
    const user = await UserModel.findByEmail(email);

    // Se não encontrou, retorna erro genérico
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // -------- VERIFICAR SENHA --------
    // Compara a senha enviada com a senha criptografada do banco
    const isPasswordValid = await UserModel.verifyPassword(password, user.password);

    // Se a senha está errada, retorna erro
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // -------- GERAR TOKEN --------
    // Se chegou aqui, está tudo certo! Gera o token de autenticação
    const token = generateToken(user.id);

    // -------- RETORNAR SUCESSO --------
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token // Token para usar nas próximas requisições
      }
    });

  } catch (error) {
    // Captura qualquer erro inesperado
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// ============ ENDPOINT: OBTER DADOS DO USUÁRIO AUTENTICADO ============
exports.getMe = async (req, res) => {
  try {
    // -------- BUSCAR USUÁRIO --------
    const user = await UserModel.findById(req.userId);

    // Se por algum motivo não encontrou (usuário foi deletado?), retorna erro
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // -------- REMOVER SENHA --------
    const { password, ...userWithoutPassword } = user;

    // -------- RETORNAR DADOS --------
    res.status(200).json({
      success: true,
      data: { user: userWithoutPassword } 
    });

  } catch (error) {
    // Captura erros (problema no banco, etc)
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do usuário'
    });
  }
};