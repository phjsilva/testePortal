const {
  buscarCertificadoPorHash,
  emitirCertificado
} = require('../services/certificados.service')
const { sendErrorResponse } = require('./error-response')

  async function getByHash(req, res) {
    try {
      const certificado = await buscarCertificadoPorHash(req.params.hash)
      return res.status(200).json(certificado)
    } catch (error) {
      return sendErrorResponse(res, error, 'Erro interno do servidor.')
    }
  }

  async function emitir(req, res) {
    try{
    const certificado = await emitirCertificado(req.usuario.id_usuario)
    return res.status(200).json(certificado)
    } catch (error) {
      return sendErrorResponse(res, error, 'Erro interno do servidor.')
    }
  }


  module.exports = {
    getByHash,
    emitir
  }