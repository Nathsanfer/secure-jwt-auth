const API_URL = 'http://localhost:3000';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');

    // Validar senhas
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('A senha deve ter no mínimo 6 caracteres!', 'error');
        return;
    }

    // Desabilitar botão
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando conta...';

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('✅ Conta criada com sucesso! Redirecionando...', 'success');
            
            // Salvar token
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Redirecionar para dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(`❌ ${data.message || 'Erro ao criar conta'}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Criar Conta';
        }
    } catch (error) {
        console.error('Erro:', error);
        showMessage('❌ Erro ao conectar com o servidor. Verifique se está rodando!', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Criar Conta';
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message message-${type}`;
    messageDiv.style.display = 'block';
}
