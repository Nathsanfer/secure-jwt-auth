const API_URL = 'http://localhost:3000';

// Verificar se está autenticado
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

// Carregar dados do usuário
async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayUserData(data.data.user);
        } else {
            showError('Token inválido ou expirado. Faça login novamente.');
            setTimeout(() => {
                logout();
            }, 2000);
        }
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar dados. Verifique se o servidor está rodando!');
    }
}

function displayUserData(user) {
    // Esconder loading
    document.getElementById('loading').style.display = 'none';
    
    // Mostrar informações
    document.getElementById('userInfo').style.display = 'block';
    
    // Preencher dados
    document.getElementById('userId').textContent = user.id;
    document.getElementById('userName').textContent = user.name || 'Não informado';
    document.getElementById('userEmail').textContent = user.email;
    
    // Formatar data
    const createdDate = new Date(user.createdAt);
    document.getElementById('userCreatedAt').textContent = createdDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Mostrar token (truncado)
    const tokenDisplay = document.getElementById('tokenDisplay');
    const truncatedToken = token.substring(0, 50) + '...';
    tokenDisplay.textContent = truncatedToken;
    tokenDisplay.title = token; // Mostrar token completo no hover
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorText').textContent = message;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Event listeners
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        logout();
    }
});

// Carregar dados ao iniciar
loadUserData();
