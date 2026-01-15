/*
  Middleware: Intercepta requisições ANTES delas chegarem ao controller.
  
  Analogia: É como o segurança do restaurante - verifica se você pode entrar
*/

// Importa a biblioteca para trabalhar com tokens JWT (convites digitais)
const jwt = require('jsonwebtoken');
// Importa o modelo para buscar usuários no banco de dados
const UserModel = require('../models/userModel');

// Função que protege rotas - só permite acesso com token válido
exports.protect = async (req, res, next) => {
  try {
    // ============ ETAPA 1: PROCURAR O TOKEN ============
    // O token vem no header da requisição, no formato: "Bearer abc123xyz"
    
    let token; // Variável que vai guardar o token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Pega só a segunda parte (o token), removendo a palavra "Bearer "
      token = req.headers.authorization.split(' ')[1];
    }

    // Se não encontrou token, bloqueia o acesso
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Token não fornecido.'
      });
    }

    // ============ ETAPA 2: VERIFICAR SE O TOKEN É VÁLIDO ============
    // Decodifica o token usando a chave secreta
    // É como verificar a assinatura do convite - se foi falsificado, vai dar erro
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // O token decodificado contém o ID do usuário que foi colocado nele no login

    // ============ ETAPA 3: VERIFICAR SE O USUÁRIO EXISTE ============
    // Busca o usuário no banco usando o ID que estava no token
    const user = await UserModel.findById(decoded.id);

    // Se o usuário não existe mais (foi deletado), bloqueia o acesso
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // ============ ETAPA 4: LIBERAR O ACESSO ============
    // Adiciona o ID do usuário no objeto 'req' para que os próximos controllers possam usar
    // Assim, qualquer rota protegida pode saber quem é o usuário logado
    req.userId = user.id;
    
    // Chama next() para passar para o próximo middleware ou controller
    // É como dizer: "Tá tudo certo, pode entrar!"
    next();

  } catch (error) {
    // ============ TRATAMENTO DE ERROS ============
    // Se algo der errado, captura o erro aqui
    
    console.error('Erro na autenticação:', error);
    
    // Erro específico: Token foi adulterado ou está mal formatado
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    // Erro específico: Token passou da validade (expirou)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    // Qualquer outro erro (problema no servidor, banco de dados, etc)
    res.status(500).json({
      success: false,
      message: 'Erro na autenticação'
    });
  }
};