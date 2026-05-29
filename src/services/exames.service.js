const {
    findResultadoExameAtualByUsuario,
    findResultadoExame,
    sincronizarDesbloqueioModulos
  } = require('../repositories/questoes.repositories')
  const { createHttpError } = require('../utils/http-error')
  
  async function listarModulosDoUsuario(idUsuario) {
    return sincronizarDesbloqueioModulos(idUsuario)
  }
  
  async function buscarResultadoAtual(idUsuario, { id_exame, modulo } = {}) {
    const idExame = id_exame ? Number(id_exame) : null
    const idModulo = modulo ? Number(modulo) : null
  
    const resultado = await findResultadoExameAtualByUsuario(
      idUsuario,
      idExame,
      idModulo
    )
  
    validarResultado(resultado, {
      notFoundMessage: 'Nenhum exame encontrado.',
      incluirDetalhesConflito: true
    })
    return resultado
  }
  
  async function buscarResultadoPorId(idUsuario, idExameParam) {
    const idExame = Number(idExameParam)
    const resultado = await findResultadoExame(idExame, idUsuario)
  
    validarResultado(resultado, {
      notFoundMessage: 'Exame nao encontrado.',
      incluirDetalhesConflito: false
    })
    return resultado
  }
  
  function validarResultado(
    resultado,
    { notFoundMessage, incluirDetalhesConflito }
  ) {
    if (!resultado) {
      throw createHttpError(404, notFoundMessage)
    }
  
    if (!resultado.concluido) {
      const details = incluirDetalhesConflito
        ? {
            id_exame: resultado.id_exame,
            id_modulo: resultado.id_modulo
          }
        : {}
  
      throw createHttpError(
        409,
        'Esta tentativa ainda nao foi finalizada.',
        details
      )
    }
  }
  
  module.exports = {
    listarModulosDoUsuario,
    buscarResultadoAtual,
    buscarResultadoPorId
  }