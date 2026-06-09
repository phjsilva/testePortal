const {
    findUsuarioByCpfAndSenha,
} = require("../repositories/usuario.repositories");
const { createToken } = require("../utils/jwt");
const { createHttpError } = require("../utils/http-error");

// Busca o usuário, compara o hash da senha e gera o token JWT
async function loginUsuario({ cpf, senha } = {}) {
    if (!cpf || !senha) {
        throw createHttpError(400, "CPF e senha sao obrigatorios");
    }

    try {
        const usuario = await findUsuarioByCpfAndSenha(cpf, senha);
        const token = createToken({ id_usuario: usuario.id_usuario });

        return {
            token,
            nome: usuario.nome,
        };
    } catch (error) {
        if (
            error.message === "usuario inexistente" ||
            error.message === "Dados de login incorretos"
        ) {
            throw createHttpError(401, "CPF ou senha incorretos.");
        }

        throw error;
    }
}

// Sem ação no servidor nesta versão; a remoção do token acontece no front-end
async function logoutUsuario() {
    return { success: true, message: "Logout realizado com sucesso", redirect: "/" };
}

module.exports = {
    loginUsuario,
    logoutUsuario,
};
