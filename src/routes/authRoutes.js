/*
    Routes: Define os endpoints da API de autenticação
    
    Analogia: É como o menu de um restaurante - lista o que está disponível
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ==================== ROTAS PÚBLICAS ====================
// Estas rotas não requerem autenticação e podem ser acessadas por qualquer cliente

// POST /api/auth/register - Cria uma nova conta de usuário
router.post('/register', authController.register);
// POST /api/auth/login - Autentica um usuário existente
router.post('/login', authController.login);

// ==================== ROTAS PROTEGIDAS ====================
// Estas rotas requerem um token JWT válido no header Authorization

// GET /api/auth/me - Retorna os dados do usuário autenticado
router.get('/me', protect, authController.getMe);

// Exporta o roteador para ser usado no servidor principal
module.exports = router;