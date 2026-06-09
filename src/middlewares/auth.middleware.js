const { verifyToken } = require("../utils/jwt");
const { findUsuarioById } = require("../repositories/usuario.repositories");

async function authMiddleware(req, res, next) {
    // Primeiro tenta obter o token do header Authorization
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        if (token) {
            try {
                const payload = verifyToken(token);
                const usuario = await findUsuarioById(payload.id_usuario);
                if (usuario) {
                    req.usuario = usuario;
                    return next();
                }
            } catch (e) {
                // Token inválido, continua verificando
            }
        }
    }

    // Se não encontrou token válido no header, verifica cookies (para compatibilidade)
    const tokenFromCookie = req.cookies?.token;
    if (tokenFromCookie) {
        try {
            const payload = verifyToken(tokenFromCookie);
            const usuario = await findUsuarioById(payload.id_usuario);
            if (usuario) {
                req.usuario = usuario;
                return next();
            }
        } catch (e) {
            // Token de cookie inválido também
        }
    }

    return res.status(401).json({ message: "token não informado" });
}

async function blockAuthMiddleware(req, res, next) {
    // Verifica se há token válido no header ou cookie
    const authHeader = req.headers.authorization;

    // Verifica se há token válido no cookie (para compatibilidade)
    const tokenFromCookie = req.cookies?.token;
    if (tokenFromCookie) {
        try {
            const payload = verifyToken(tokenFromCookie);
            // Se o token é válido, redireciona para o hub
            if (payload) {
                return res.redirect("/hub.html");
            }
        } catch (e) {
            // Token inválido, continua a execução normal
        }
    }

    // Verifica se há token válido no header
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const payload = verifyToken(token);
                // Se o token é válido, redireciona para o hub
                if (payload) {
                    return res.redirect("/hub.html");
                }
            } catch (e) {
                // Token inválido, continua a execução normal
            }
        }
    }

    // Se não encontrou token válido, permite o acesso à página inicial
    return next();
}

module.exports = {
    authMiddleware,
    blockAuthMiddleware,
};
