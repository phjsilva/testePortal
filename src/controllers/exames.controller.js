const {
    listarModulosDoUsuario,
    buscarResultadoAtual,
    buscarResultadoPorId
  } = require('../services/exames.service')
  const { sendErrorResponse } = require('./error-response')
  
  async function list(req, res) {
    try {
      const exames = await listarModulosDoUsuario(req.usuario.id_usuario)
      return res.status(200).json(exames)
    } catch (error) {
      return sendErrorResponse(res, error)
    }
  }
  
  async function getResultadoAtual(req, res) {
    try {
      const resultado = await buscarResultadoAtual(
        req.usuario.id_usuario,
        req.query
      )
  
      return res.status(200).json(resultado)
    } catch (error) {
      return sendErrorResponse(res, error)
    }
  }
  
  async function getResultado(req, res) {
    try {
      const resultado = await buscarResultadoPorId(
        req.usuario.id_usuario,
        req.params.idExame
      )
  
      return res.status(200).json(resultado)
    } catch (error) {
      return sendErrorResponse(res, error)
    }
  }
  
  module.exports = {
    list,
    getResultadoAtual,
    getResultado
  }