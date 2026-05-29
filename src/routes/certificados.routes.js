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

module.exports = router