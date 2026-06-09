// Objeto global com métodos de sessão acessíveis em qualquer página
// Esta versão do logout NÃO chama a API — apenas remove o token localmente
// É usada como fallback ou por botões que não precisam notificar o servidor
(function () {
    window.PortalSession = {
        // Obtém o token JWT salvo no localStorage
        getToken: function () {
            return localStorage.getItem("token");
        },
        // Remove o token e redireciona para a home — NÃO chama a API de logout
        logout: function () {
            localStorage.removeItem("token");
            window.location.href = '/';
        },
    };
})();