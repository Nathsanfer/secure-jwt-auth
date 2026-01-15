# 📁 Estrutura MVC do Projeto

Este projeto segue o padrão **MVC (Model-View-Controller)** para organização do código.

## 🏗️ Estrutura de Pastas

```
autenticacao/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── dev.db                 # Banco de dados SQLite
│
├── src/
│   ├── models/                # 📊 MODELS - Camada de Dados
│   │   └── userModel.js       # Modelo de usuário com operações CRUD
│   │
│   ├── views/                 # 👁️ VIEWS - Camada de Apresentação
│   │   └── (em public/)       # Views estão na pasta public/
│   │
│   ├── controllers/           # 🎮 CONTROLLERS - Camada de Lógica
│   │   └── authController.js  # Controlador de autenticação
│   │
│   ├── middleware/            # 🛡️ MIDDLEWARE
│   │   └── authMiddleware.js  # Middleware de autenticação JWT
│   │
│   ├── routes/                # 🛣️ ROTAS
│   │   └── authRoutes.js      # Rotas de autenticação
│   │
│   ├── config/                # ⚙️ CONFIGURAÇÕES
│   │   └── prisma.js          # Configuração do Prisma Client
│   │
│   └── server.js              # 🚀 Servidor Express
│
├── public/                    # 🌐 VIEWS (Frontend)
│   ├── index.html             # Página inicial
│   ├── register.html          # Página de registro
│   ├── login.html             # Página de login
│   ├── dashboard.html         # Dashboard do usuário
│   ├── styles.css             # Estilos globais
│   ├── register.js            # Lógica de registro
│   ├── login.js               # Lógica de login
│   └── dashboard.js           # Lógica do dashboard
│
├── .env                       # Variáveis de ambiente
├── package.json               # Dependências do projeto
└── README.md                  # Documentação
```

## 🔄 Fluxo de Dados MVC

```
┌─────────────┐
│   CLIENTE   │
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────┐
│      ROUTES         │  ← Define endpoints
│  (authRoutes.js)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   MIDDLEWARE        │  ← Valida JWT
│ (authMiddleware.js) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   CONTROLLER        │  ← Processa lógica de negócio
│(authController.js)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│      MODEL          │  ← Interage com banco de dados
│  (userModel.js)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   DATABASE          │
│  (SQLite/Prisma)    │
└──────┬──────────────┘
       │
       ▼
    Response
       │
       ▼
┌─────────────────────┐
│       VIEW          │  ← Renderiza interface
│  (HTML/CSS/JS)      │
└─────────────────────┘
```

## 📊 Model (userModel.js)

**Responsabilidade**: Gerenciar dados e lógica de banco de dados

### Métodos disponíveis:

- `findById(id)` - Buscar usuário por ID
- `findByEmail(email)` - Buscar usuário por email
- `create(userData)` - Criar novo usuário
- `update(id, userData)` - Atualizar usuário
- `delete(id)` - Deletar usuário
- `findAll()` - Listar todos os usuários
- `verifyPassword(plain, hashed)` - Verificar senha

### Exemplo de uso:

```javascript
const UserModel = require('../models/userModel');

// Criar usuário
const user = await UserModel.create({
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123'
});

// Buscar usuário
const user = await UserModel.findByEmail('joao@email.com');

// Verificar senha
const isValid = await UserModel.verifyPassword('senha123', user.password);
```

## 👁️ View (public/*.html)

**Responsabilidade**: Interface do usuário e apresentação

### Páginas:

1. **index.html** - Landing page com navegação
2. **register.html** - Formulário de cadastro
3. **login.html** - Formulário de login
4. **dashboard.html** - Área protegida do usuário

### Arquivos JavaScript:

- **register.js** - Lógica de registro no frontend
- **login.js** - Lógica de autenticação no frontend
- **dashboard.js** - Lógica do dashboard no frontend

## 🎮 Controller (authController.js)

**Responsabilidade**: Processar requisições e coordenar Model e View

### Funções:

1. **register** - Registrar novo usuário
2. **login** - Autenticar usuário
3. **getMe** - Obter dados do usuário autenticado

### Exemplo:

```javascript
exports.register = async (req, res) => {
  // 1. Validar dados
  // 2. Verificar se usuário existe (usando Model)
  // 3. Criar usuário (usando Model)
  // 4. Gerar token JWT
  // 5. Retornar resposta
};
```

## 🛣️ Routes (authRoutes.js)

**Responsabilidade**: Definir endpoints da API

```javascript
POST   /api/auth/register  → authController.register
POST   /api/auth/login     → authController.login
GET    /api/auth/me        → authMiddleware.protect → authController.getMe
```

## 🛡️ Middleware (authMiddleware.js)

**Responsabilidade**: Proteger rotas privadas

- Valida token JWT
- Verifica se usuário existe (usando Model)
- Adiciona userId ao request

## ⚙️ Config (prisma.js)

**Responsabilidade**: Configuração do Prisma Client

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

## 🚀 Server (server.js)

**Responsabilidade**: Inicializar aplicação Express

- Configura middlewares globais
- Serve arquivos estáticos (Views)
- Define rotas da API
- Inicia servidor HTTP

## 🔐 Segurança

- **Senhas**: Hash com bcryptjs (salt rounds: 10)
- **Tokens**: JWT com expiração configurável
- **Middleware**: Proteção de rotas sensíveis
- **Validação**: Verificação de dados no Controller

## 📝 Vantagens da Arquitetura MVC

✅ **Separação de responsabilidades** - Cada camada tem função específica  
✅ **Manutenibilidade** - Fácil localizar e modificar código  
✅ **Escalabilidade** - Adicionar novos recursos sem afetar código existente  
✅ **Testabilidade** - Testar cada camada independentemente  
✅ **Reutilização** - Models podem ser usados por múltiplos Controllers  
✅ **Organização** - Estrutura clara e padronizada  

## 🧪 Testando o Sistema

```bash
# Iniciar servidor
node src/server.js

# Acessar no navegador
http://localhost:3000
```

### Endpoints da API:

```bash
# Registrar usuário
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Teste",
  "email": "teste@email.com",
  "password": "senha123"
}

# Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teste@email.com",
  "password": "senha123"
}

# Obter dados do usuário (rota protegida)
GET http://localhost:3000/api/auth/me
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📚 Próximos Passos

Para expandir o projeto, você pode adicionar:

- Mais models (ex: `postModel.js`, `commentModel.js`)
- Mais controllers (ex: `postController.js`)
- Validação com bibliotecas como `joi` ou `express-validator`
- Testes automatizados com `jest` ou `mocha`
- Documentação da API com Swagger
- Upload de arquivos
- Recuperação de senha
- Refresh tokens
