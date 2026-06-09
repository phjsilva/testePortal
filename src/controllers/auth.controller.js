const { loginUsuario } = require("../services/auth.service");
const { sendErrorResponse } = require("./error-response");

/*
POST /api/auth/login
Como testar:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"cpf\":\"12345678900\",\"senha\":\"123456\"}"
Payload esperado: { "cpf": "12345678900", "senha": "123456" }
Resposta 200: { "token": "jwt", "nome": "Nome do aluno" }
Códigos possíveis: 200, 400, 401, 500
*/
async function login(req, res) {
    try {
        const result = await loginUsuario(req.body);
        return res.status(200).json(result);
    } catch (error) {
        return sendErrorResponse(res, error, "Erro interno do servidor.");
    }
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
