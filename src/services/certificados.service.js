const {
  findCertificadoByHash,
  findProgressoByUsuarioId
} = require('../repositories/certificados.repositories')
const { createHttpError } = require('../utils/http-error')
const { findUsuarioById } = require('../repositories/usuario.repositories')
  
  async function buscarCertificadoPorHash(hash) {
    const certificadoHash = String(hash || '').trim()
  
    if (!certificadoHash) {
      throw createHttpError(400, 'Hash do certificado obrigatorio.')
    }
  
    const certificado = await findCertificadoByHash(certificadoHash)
  
    if (!certificado) {
      throw createHttpError(404, 'Certificado inexistente para o hash informado.')
    }
  
    if (certificado.indisponivel) {
      throw createHttpError(409, certificado.motivo)
    }
  
    return certificado
  }
  
  async function emitirCertificado(idUsuario) {
    const usuario = await findUsuarioById(idUsuario)
  
    if (!usuario) {
      throw createHttpError(404, 'Usuario não encontrado.')
    }
    const bloqueio = await findProgressoByUsuarioId(idUsuario)

    if (bloqueio?.indisponivel) {
      throw createHttpError(403, bloqueio.motivo)
    }
    
    return { certificadoHash: usuario.certificado_hash }
  }
  module.exports = {
    buscarCertificadoPorHash,
    emitirCertificado
  }