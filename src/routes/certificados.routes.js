const { authMiddleware } = require('../middlewares/auth.middleware')
const { Router } = require('express')
const certificadosController = require('../controllers/certificados.controller')

const router = Router()

/*
GET /api/certificados/hash/:hash
Como testar:
curl -X GET http://localhost:3000/api/certificados/hash/HASH_DO_CERTIFICADO
Payload esperado: nenhum. Parametro esperado: hash na URL.
Resposta 200: dados do certificado, aluno e progresso.
Codigos possiveis: 200, 400, 404, 409, 500
*/
router.get('/hash/:hash', certificadosController.getByHash)

/*
POST /api/certificados/emitir
Como testar:
curl -X POST http://localhost:3000/api/certificados/emitir
Payload esperado: nenhum. Autenticacao via cookie JWT.
Resposta 200: hash do certificado.
Codigos possiveis: 200, 401, 403, 404, 500
*/
router.post('/emitir', authMiddleware, certificadosController.emitir)

module.exports = router