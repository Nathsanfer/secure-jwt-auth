# 🧪 Guia de Teste - API de Autenticação

## ⚠️ Pré-requisitos

Antes de testar, você precisa:

1. **PostgreSQL rodando** na porta 5432
2. **Banco de dados criado** com o nome `auth_db`
3. **Executar as migrations**: `npx prisma migrate dev --name init`
4. **Servidor rodando**: `node src/server.js`

---

## 📋 Opções para Testar

### Opção 1: Usar extensão REST Client do VS Code

1. Instale a extensão "REST Client" no VS Code
2. Abra o arquivo `test-api.http`
3. Clique em "Send Request" acima de cada requisição

### Opção 2: Usar PowerShell com Invoke-WebRequest

```powershell
# 1. Testar rota raiz
Invoke-WebRequest -Uri "http://localhost:3000/" -Method GET

# 2. Registrar usuário
$body = @{
    name = "João Silva"
    email = "joao@exemplo.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# 3. Fazer login
$loginBody = @{
    email = "joao@exemplo.com"
    password = "senha123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).data.token

# 4. Acessar rota protegida
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers $headers
```

### Opção 3: Usar curl

```bash
# 1. Testar rota raiz
curl http://localhost:3000/

# 2. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"João Silva\",\"email\":\"joao@exemplo.com\",\"password\":\"senha123\"}"

# 3. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"joao@exemplo.com\",\"password\":\"senha123\"}"

# Copie o token da resposta e use no próximo comando

# 4. Acessar rota protegida (substitua SEU_TOKEN pelo token recebido)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Opção 4: Usar Postman ou Insomnia

1. Baixe [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/download)
2. Importe as requisições abaixo:

**Registrar Usuário:**
- Método: `POST`
- URL: `http://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Login:**
- Método: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Ver Perfil (Rota Protegida):**
- Método: `GET`
- URL: `http://localhost:3000/api/auth/me`
- Headers: 
  - `Authorization: Bearer SEU_TOKEN_AQUI`

---

## 🗄️ Configurar o Banco de Dados

Se você ainda não criou o banco de dados:

```powershell
# 1. Conectar ao PostgreSQL (você precisa ter PostgreSQL instalado)
psql -U postgres

# 2. Criar o banco de dados
CREATE DATABASE auth_db;

# 3. Sair
\q

# 4. Executar as migrations do Prisma
npx prisma migrate dev --name init
```

---

## ✅ Respostas Esperadas

### Rota Raiz (/)
```json
{
  "message": "API de Autenticação funcionando!"
}
```

### Registro (/api/auth/register)
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "email": "joao@exemplo.com",
      "name": "João Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login (/api/auth/login)
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "email": "joao@exemplo.com",
      "name": "João Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Perfil (/api/auth/me)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "joao@exemplo.com",
      "name": "João Silva",
      "createdAt": "2026-01-13T..."
    }
  }
}
```

---

## 🐛 Problemas Comuns

### Servidor não conecta
- Verifique se o servidor está rodando: `node src/server.js`
- Veja se a porta 3000 está livre

### Erro de banco de dados
- Verifique se o PostgreSQL está rodando
- Confira as credenciais no arquivo `.env`
- Execute as migrations: `npx prisma migrate dev`

### Token inválido
- Certifique-se de copiar o token completo da resposta do login
- O token expira em 7 dias (configurável no `.env`)
