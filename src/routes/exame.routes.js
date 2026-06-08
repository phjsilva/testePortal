const { Router } = require('express')
const examesController = require('../controllers/exames.controller')
const {authMiddleware} = require('../middlewares/auth.middleware')

const router = Router()

/*
GET /api/exames
Como testar:
curl -X GET http://localhost:3000/api/exames \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum.
Resposta 200: lista de modulos com status de desbloqueio.
Codigos possiveis: 200, 401, 500
*/
router.get('/', authMiddleware, examesController.list)

/*
GET /api/exames/resultado-atual?modulo=1
Como testar:
curl -X GET "http://localhost:3000/api/exames/resultado-atual?modulo=1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum. Query opcional: modulo ou id_exame.
Resposta 200: resultado de uma tentativa concluida.
Codigos possiveis: 200, 401, 404, 409, 500
*/
router.get('/resultado-atual', authMiddleware, examesController.getResultadoAtual)

/*
GET /api/exames/resultado/1
Como testar:
curl -X GET http://localhost:3000/api/exames/resultado/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum. Parametro esperado: idExame na URL.
Resposta 200: resultado do exame informado.
Codigos possiveis: 200, 401, 404, 409, 500
*/
router.get('/resultado/:idExame', authMiddleware, examesController.getResultado)

module.exports = router