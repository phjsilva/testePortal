function tokenValido() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        localStorage.removeItem("token");
        return false;
    }
}

// Para paginas autenticadas (painel, perfil, etc.)
function requireAuth() {
    if (!tokenValido()) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }
}

// Para paginas publicas (index, login, cadastro)
function requireGuest() {
    const autenticado = tokenValido();

    if (autenticado) {
        window.location.href = "/hub.html";
    }
}

function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

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

// Função específica para logout
async function logout() {
    try {
        const response = await apiFetch("/api/auth/logout", {
            method: "POST",
        });

        if (response.ok) {
            localStorage.removeItem("token");
            window.location.href = "/";
        } else {
            console.error("Erro ao fazer logout");
        }
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
}
