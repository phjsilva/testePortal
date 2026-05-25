const {
  iniciarModulo,
  buscarExameAtual,
  responderQuestao,
  criarProximaTentativa,
  buscarModuloAtual,
  listarExamesUsuario
} = require('../services/questoes.service')
const { sendErrorResponse } = require('./error-response')

async function startModulo(req, res) {
  try {
    const exame = await iniciarModulo(req.usuario.id_usuario, req.body?.id_modulo)
    return res.status(200).json(exame)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function getExameAtual(req, res) {
  try {
    const exame = await buscarExameAtual(req.usuario.id_usuario, req.query)
    return res.status(200).json(exame)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function answer(req, res) {
  try {
    const result = await responderQuestao(req.usuario.id_usuario, req.body)
    return res.status(result.statusCode).json(result.data)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function nextAttempt(req, res) {
  try {
    const exame = await criarProximaTentativa(req.usuario.id_usuario, req.body)
    return res.status(200).json(exame)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function getModuloAtual(req, res) {
  try {
    const modulo = await buscarModuloAtual(req.usuario.id_usuario)
    return res.status(200).json(modulo)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

async function listExames(req, res) {
  try {
    const exames = await listarExamesUsuario(req.usuario.id_usuario)
    return res.status(200).json(exames)
  } catch (error) {
    return sendErrorResponse(res, error)
  }
}

module.exports = {
  startModulo,
  getExameAtual,
  answer,
  nextAttempt,
  getModuloAtual,
  listExames
}
