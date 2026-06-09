const {
    findUsuarioByCpfAndSenha,
} = require("../repositories/usuario.repositories");
const { createToken } = require("../utils/jwt");
const { createHttpError } = require("../utils/http-error");

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
            error.message === "Usuario inexistente" ||
            error.message === "Dados de login incorretos"
        ) {
            throw createHttpError(401, "CPF ou senha incorretos.");
        }

        throw error;
    }
}

module.exports = {
    loginUsuario,
};
