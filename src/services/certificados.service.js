const {
  findCertificadoByHash
} = require('../repositories/certificados.repositories')
const { createHttpError } = require('../utils/http-error')

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

module.exports = {
  buscarCertificadoPorHash
}
