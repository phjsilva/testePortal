function tokenValido() {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    localStorage.removeItem('token')
    return false
  }
}

// Para pÃ¡ginas autenticadas (painel, perfil, etc.)
function requireAuth() {
  if (!tokenValido()) {
    localStorage.removeItem('token')
    window.location.href = '/login.html'
  }
}

// Para pÃ¡ginas pÃºblicas (login, cadastro, index)
function requireGuest() {
  if (tokenValido()) {
    window.location.href = '/hub.html'
  }
}

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: authHeaders()
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login.html'
    return
  }

  return response
}