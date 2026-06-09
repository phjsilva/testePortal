// Decodifica o payload do JWT em base64 e verifica se o token ainda não expirou
function tokenValido() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        // Divide o JWT em 3 partes e decodifica o payload em base64
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Retorna false se o token já expirou
        return payload.exp * 1000 > Date.now();
    } catch {
        localStorage.removeItem("token");
        return false;
    }
}

// Para páginas autenticadas (painel, perfil, etc.) — redireciona para login se token inválido
function requireAuth() {
    if (!tokenValido()) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }
}

// Para páginas públicas (index, login, cadastro) — redireciona para hub se já autenticado
function requireGuest() {
    const autenticado = tokenValido();

    if (autenticado) {
        window.location.href = "/hub.html";
    }
}

// Retorna o header Authorization: Bearer <token> para requisições autenticadas
function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

/*
Wrapper de fetch que injeta o header de auth e redireciona para /login.html em caso de 401
GET/POST /api/...
Como testar:
fetch("/api/exames", { method: "GET" })
  .then(r => r.json())
  .then(console.log)
*/
async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: authHeaders(),
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
    }

    return response;
}

/*
POST /api/auth/logout
Como testar:
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
Payload esperado: nenhum
Resposta 200: { "success": true, "message": "Logout realizado com sucesso", "redirect": "/" }
Códigos possíveis: 200, 401, 500
*/
// Função específica para logout — chamada pelo botão de sair no hub.html
// Remove o token do localStorage e redireciona para a home
async function logout() {
    const response = await apiFetch("/api/auth/logout", { method: "POST" });
    // Protege contra response undefined (ex: apiFetch retorna undefined após 401)
    if (response && response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
}
