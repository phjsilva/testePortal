const { Router } = require('express')
const usuarioController = require('../controllers/usuario.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

/*
POST /api/usuarios
Como testar:
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Ana Silva\",\"email\":\"ana@email.com\",\"cpf\":\"12345678900\",\"senha\":\"123456\"}"
Payload esperado: { "nome": "Ana Silva", "email": "ana@email.com", "cpf": "12345678900", "senha": "123456" }
Resposta 201: usuario criado com id_usuario, nome, email, cpf e certificado_hash.
Codigos possiveis: 201, 400, 409, 500
*/
router.post('/', usuarioController.create)

/*
GET /api/usuarios/me
Como testar:
curl -X GET http://localhost:3000/api/usuarios/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum.
Resposta 200: dados do usuario autenticado.
Codigos possiveis: 200, 401, 404, 500
*/
router.get('/me', authMiddleware, usuarioController.me)

/*
PATCH /api/usuarios/cpf
Como testar:
curl -X PATCH http://localhost:3000/api/usuarios/cpf \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"cpf\":\"98765432100\"}"
Payload esperado: { "cpf": "98765432100" }
Resposta 200: usuario atualizado.
Codigos possiveis: 200, 400, 401, 404, 409, 500
*/
router.patch('/cpf', authMiddleware, usuarioController.updateCpf)

/*
PATCH /api/usuarios/nome
Como testar:
curl -X PATCH http://localhost:3000/api/usuarios/nome \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Ana Souza\"}"
Payload esperado: { "nome": "Ana Souza" }
Resposta 200: usuario atualizado.
Codigos possiveis: 200, 400, 401, 404, 500
*/
router.patch('/nome', authMiddleware, usuarioController.updateNome)

/*
PATCH /api/usuarios/email
Como testar:
curl -X PATCH http://localhost:3000/api/usuarios/email \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana.novo@email.com\"}"
Payload esperado: { "email": "ana.novo@email.com" }
Resposta 200: usuario atualizado.
Codigos possiveis: 200, 400, 401, 404, 409, 500
*/
router.patch('/email', authMiddleware, usuarioController.updateEmail)

/*
PATCH /api/usuarios/senha
Como testar:
curl -X PATCH http://localhost:3000/api/usuarios/senha \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"senha\":\"654321\"}"
Payload esperado: { "senha": "654321" }
Resposta 200: usuario atualizado.
Codigos possiveis: 200, 400, 401, 404, 500
*/
router.patch('/senha', authMiddleware, usuarioController.updateSenha)

module.exports = router
