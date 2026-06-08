const { Router } = require('express')
const questoesController = require('../controllers/questoes.controller')
const {authMiddleware} = require('../middlewares/auth.middleware')

const router = Router()

/*
POST /api/questoes/iniciar-modulo
Como testar:
curl -X POST http://localhost:3000/api/questoes/iniciar-modulo \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"id_modulo\":1}"
Payload esperado: { "id_modulo": 1 }
Resposta 200: exame criado ou retomado com lista de questoes.
Codigos possiveis: 200, 400, 401, 403, 404, 409, 500
*/
router.post('/iniciar-modulo', authMiddleware, questoesController.startModulo)

/*
GET /api/questoes/exame-atual?modulo=1
Como testar:
curl -X GET "http://localhost:3000/api/questoes/exame-atual?modulo=1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum. Query opcional: modulo ou id_exame.
Resposta 200: exame em andamento com questoes.
Codigos possiveis: 200, 401, 404, 500
*/
router.get('/exame-atual', authMiddleware, questoesController.getExameAtual)

/*
POST /api/questoes/responder
Como testar:
curl -X POST http://localhost:3000/api/questoes/responder \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"id_exame\":1,\"id_questao\":10,\"resposta\":\"a\"}"
Payload esperado: { "id_exame": 1, "id_questao": 10, "resposta": "a" }
Resposta 201: resposta criada. Resposta 200: resposta atualizada.
Codigos possiveis: 200, 201, 400, 401, 404, 500
*/
router.post('/responder', authMiddleware, questoesController.answer)

/*
PATCH /api/questoes/proxima-tentativa
Como testar:
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"id_exame\":1}"
Payload esperado: { "id_exame": 1 } ou { "id_modulo": 1 }
Resposta 200: nova tentativa com lista de questoes.
Codigos possiveis: 200, 401, 404, 409, 500
*/
router.patch('/proxima-tentativa', authMiddleware, questoesController.nextAttempt)

/*
GET /api/questoes/modulo-atual
Como testar:
curl -X GET http://localhost:3000/api/questoes/modulo-atual \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum.
Resposta 200: modulo/exame em andamento.
Codigos possiveis: 200, 401, 404, 500
*/
router.get('/modulo-atual', authMiddleware, questoesController.getModuloAtual)

/*
GET /api/questoes/exames
Como testar:
curl -X GET http://localhost:3000/api/questoes/exames \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum.
Resposta 200: lista de modulos com status e tentativas.
Codigos possiveis: 200, 401, 500
*/
router.get('/exames', authMiddleware, questoesController.listExames)

module.exports = router