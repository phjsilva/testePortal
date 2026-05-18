const { Router } = require('express')
const {
  findUsuarioByCpfAndSenha
} = require('../repositories/usuario.repositories')
const { createToken } = require('../utils/jwt')

const router = Router()

router.post('/login', async function (req, res) {
  const { cpf, senha } = req.body

  if (!cpf || !senha) {
    return res.status(400).json({ message: 'CPF e senha sao obrigatorios' })
  }

  try {
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha)
    const token = createToken({ id_usuario: usuario.id_usuario })
    return res.status(200).json({ token, nome: usuario.nome })
  } catch (error) {
    if (
      error.message === 'Usuario nao encontrado.' ||
      error.message === 'Senha invalida.' ||
      error.message === 'usuario inexistente' ||
      error.message === 'Dados de login incorretos'
    ) {
      return res.status(401).json({ message: 'CPF ou senha incorretos.' })
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' })
  }
})

module.exports = router