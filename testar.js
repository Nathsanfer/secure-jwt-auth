// Script para testar a API de autenticação
const API_URL = 'http://localhost:3000';

// Função auxiliar para fazer requisições
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

async function testarAutenticacao() {
  console.log('🚀 Iniciando testes de autenticação...\n');

  try {
    // 1. Testar rota raiz
    console.log('1️⃣ Testando rota raiz...');
    const root = await request('/');
    console.log('✅ Status:', root.status);
    console.log('📦 Resposta:', root.data);
    console.log('');

    // 2. Registrar novo usuário
    console.log('2️⃣ Registrando novo usuário...');
    const email = `teste${Date.now()}@exemplo.com`;
    const register = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Usuário Teste',
        email: email,
        password: 'senha123'
      })
    });
    console.log('✅ Status:', register.status);
    console.log('📦 Resposta:', register.data);
    console.log('');

    // 3. Fazer login
    console.log('3️⃣ Fazendo login...');
    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: 'senha123'
      })
    });
    console.log('✅ Status:', login.status);
    console.log('📦 Resposta:', login.data);
    
    const token = login.data.data?.token;
    console.log('🔑 Token recebido:', token ? 'Sim' : 'Não');
    console.log('');

    if (!token) {
      console.log('❌ Não foi possível obter o token. Parando testes.');
      return;
    }

    // 4. Acessar rota protegida
    console.log('4️⃣ Acessando rota protegida...');
    const me = await request('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Status:', me.status);
    console.log('📦 Resposta:', me.data);
    console.log('');

    // 5. Testar rota protegida sem token
    console.log('5️⃣ Testando rota protegida SEM token (deve falhar)...');
    const meNoAuth = await request('/api/auth/me', {
      method: 'GET'
    });
    console.log('✅ Status:', meNoAuth.status);
    console.log('📦 Resposta:', meNoAuth.data);
    console.log('');

    // 6. Testar login com senha incorreta
    console.log('6️⃣ Testando login com senha incorreta (deve falhar)...');
    const loginFail = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: 'senhaErrada'
      })
    });
    console.log('✅ Status:', loginFail.status);
    console.log('📦 Resposta:', loginFail.data);
    console.log('');

    console.log('✅ Todos os testes concluídos!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar testes
testarAutenticacao();
