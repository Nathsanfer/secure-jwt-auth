# Script de teste da API de Autenticação
Write-Host "🚀 Testando API de Autenticação" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# 1. Testar rota raiz
Write-Host "1️⃣ Testando rota raiz..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json) -ForegroundColor White
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Registrar novo usuário
Write-Host "2️⃣ Registrando novo usuário..." -ForegroundColor Yellow
$email = "teste$(Get-Date -Format 'yyyyMMddHHmmss')@exemplo.com"
$registerBody = @{
    name = "Usuário Teste"
    email = $email
    password = "senha123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json"
    
    Write-Host "✅ Usuário registrado com sucesso!" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
} catch {
    Write-Host "❌ Erro no registro: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
}
Write-Host ""

# 3. Fazer login
Write-Host "3️⃣ Fazendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = "senha123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host ($loginResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
    
    $token = $loginResponse.data.token
    Write-Host ""
    Write-Host "🔑 Token JWT recebido:" -ForegroundColor Cyan
    Write-Host $token -ForegroundColor Yellow
} catch {
    Write-Host "❌ Erro no login: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# 4. Acessar rota protegida com token
Write-Host "4️⃣ Acessando rota protegida (com token)..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Acesso autorizado!" -ForegroundColor Green
    Write-Host ($meResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao acessar rota protegida: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Testar rota protegida SEM token
Write-Host "5️⃣ Tentando acessar rota protegida SEM token (deve falhar)..." -ForegroundColor Yellow
try {
    $meResponseNoAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method GET -ErrorAction Stop
    
    Write-Host "⚠️ Atenção: Deveria ter falhado mas funcionou!" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Acesso negado corretamente (401 Unauthorized)" -ForegroundColor Green
}
Write-Host ""

# 6. Testar login com senha incorreta
Write-Host "6️⃣ Tentando login com senha incorreta (deve falhar)..." -ForegroundColor Yellow
$wrongLoginBody = @{
    email = $email
    password = "senhaErrada123"
} | ConvertTo-Json

try {
    $wrongLoginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -Body $wrongLoginBody `
        -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "⚠️ Atenção: Login com senha errada deveria ter falhado!" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Login negado corretamente (401 Unauthorized)" -ForegroundColor Green
}
Write-Host ""

Write-Host "✅ Todos os testes concluídos!" -ForegroundColor Cyan
