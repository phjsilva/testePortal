const {
  criarUsuario,
  buscarUsuarioLogado,
  atualizarUsuario
} = require('../services/usuario.service')
const { sendErrorResponse } = require('./error-response')

async function create(req, res) {
  try {
    const usuario = await criarUsuario(req.body)
    return res.status(201).json(usuario)
  } catch (error) {
    return sendErrorResponse(res, tratarErroUnico(error))
  }
}

async function me(req, res) {
  try {
    const usuario = await buscarUsuarioLogado(req.usuario.id_usuario)
    return res.status(200).json(usuario)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function updateCpf(req, res) {
  return updateCampo(req, res, 'cpf')
}

async function updateNome(req, res) {
  return updateCampo(req, res, 'nome')
}

async function updateEmail(req, res) {
  return updateCampo(req, res, 'email')
}

async function updateSenha(req, res) {
  return updateCampo(req, res, 'senha')
}

async function updateCampo(req, res, campo) {
  try {
    const usuario = await atualizarUsuario(
      req.usuario.id_usuario,
      campo,
      req.body[campo]
    )

    return res.status(200).json(usuario)
  } catch (error) {
    return sendErrorResponse(res, tratarErroUnico(error))
  }
}

function tratarErroUnico(error) {
  if (error && error.code === '23505') {
    error.statusCode = 409
    error.message = 'Ja existe usuario com os dados informados'
  }

  return error
}

module.exports = {
  create,
  me,
  updateCpf,
  updateNome,
  updateEmail,
  updateSenha
}
