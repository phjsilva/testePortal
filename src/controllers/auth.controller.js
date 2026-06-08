const { loginUsuario } = require("../services/auth.service");
const { sendErrorResponse } = require("./error-response");

async function login(req, res) {
    try {
        const result = await loginUsuario(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return sendErrorResponse(res, error, "Erro interno do servidor.");
    }
}

async function logout(req, res) {
    try {
        // Retorna sucesso e indica que o frontend deve redirecionar para a página inicial
        return res.status(200).json({
            success: true,
            message: "Logout realizado com sucesso",
            redirect: "/",
        });
    } catch (e) {
        return sendErrorResponse(res, e, "Erro interno do servidor.");
    }
}

module.exports = {
    login,
    logout,
};
