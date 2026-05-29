const {
    findQuestoesDoExameAtualByUsuario,
    findQuestoesPorExame,
    usuarioConcluiuExame,
    findModuloAtualByUsuario,
    findUltimoExameFinalizado,
    insertProximaTentativa,
    criarExameModulo,
    findQuestaoDoExameByUsuario,
    findRespostaByExameEQuestao,
    findResultadoExame,
    findExamePorIdParaUsuario,
    inserirRespostaQuestao,
    atualizarRespostaQuestao,
    calcularNotaResposta,
    normalizarAlternativa,
    NOTA_MINIMA_APROVACAO,
    findExamesByUsuario
  } = require('../repositories/questoes.repositories')
  const { createHttpError } = require('../utils/http-error')
  
  function mapQuestoesResponse(exame) {
    return {
      ...exame,
      questoes: exame.questoes.map((questao) => ({
        ...questao,
        imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null
      }))
    }
  }
  
  async function iniciarModulo(idUsuario, idModulo) {
    const idModuloNumber = Number(idModulo)
  
    if (!idModuloNumber) {
      throw createHttpError(400, 'id_modulo e obrigatorio.')
    }
  
    const exame = await criarExameModulo(idUsuario, idModuloNumber)
    return mapQuestoesResponse(exame)
  }
  
  async function buscarExameAtual(idUsuario, { modulo, id_exame } = {}) {
    const idModulo = modulo ? Number(modulo) : null
    const idExame = id_exame ? Number(id_exame) : null
  
    const exame = idExame
      ? await findQuestoesPorExame(idExame, idUsuario)
      : await findQuestoesDoExameAtualByUsuario(idUsuario, idModulo)
  
    if (!exame) {
      throw createHttpError(
        404,
        'Nenhum exame em andamento encontrado para este modulo.'
      )
    }
  
    return mapQuestoesResponse(exame)
  }
  
  function validarRespostaPayload({ id_exame, id_questao, resposta } = {}) {
    if (!id_exame || !id_questao || !resposta) {
      throw createHttpError(400, 'Exame, questao e resposta sao obrigatorios.')
    }
  
    const respostaNormalizada = normalizarAlternativa(resposta)
  
    if (!['a', 'b', 'c', 'd'].includes(respostaNormalizada)) {
      throw createHttpError(400, 'Resposta invalida.')
    }
  
    return respostaNormalizada
  }
  
  async function responderQuestao(idUsuario, payload) {
    const { id_exame, id_questao } = payload
    const respostaNormalizada = validarRespostaPayload(payload)
  
    const exame = await findExamePorIdParaUsuario(id_exame, idUsuario)
  
    if (!exame) {
      throw createHttpError(404, 'Exame nao encontrado.')
    }
  
    const questao = await findQuestaoDoExameByUsuario(
      idUsuario,
      id_exame,
      id_questao
    )
  
    if (!questao) {
      throw createHttpError(404, 'Questao nao pertence a este exame ou modulo.')
    }
  
    const nota = calcularNotaResposta(
      questao.alternativa_correta,
      respostaNormalizada
    )
  
    const respostaExistente = await findRespostaByExameEQuestao(
      id_exame,
      id_questao
    )
  
    const respostaSalva = respostaExistente
      ? await atualizarRespostaQuestao(
          id_exame,
          id_questao,
          respostaNormalizada,
          nota
        )
      : await inserirRespostaQuestao(
          id_exame,
          id_questao,
          respostaNormalizada,
          nota
        )
  
    const proximoEstado = await buscarProximoEstado(idUsuario, exame, id_exame)
  
    return {
      statusCode: respostaExistente ? 200 : 201,
      data: {
        ...respostaSalva,
        nota_questao: nota,
        proximo_estado: proximoEstado
      }
    }
  }
  
  async function buscarProximoEstado(idUsuario, exame, idExame) {
    if (!(await usuarioConcluiuExame(idExame))) {
      return null
    }
  
    const resultado = await findResultadoExame(idExame, idUsuario)
    const aprovado = Number(resultado?.nota ?? 0) >= NOTA_MINIMA_APROVACAO
  
    if (aprovado) {
      return {
        status: 'modulo_aprovado',
        id_exame: idExame,
        id_modulo: exame.id_modulo,
        nota: resultado.nota
      }
    }
  
    if (Number(exame.tentativa) < 2) {
      return {
        status: 'modulo_concluido',
        id_exame: idExame,
        pode_tentar_novamente: true,
        nota: resultado.nota
      }
    }
  
    return {
      status: 'modulo_reprovado',
      id_exame: idExame,
      tentativas_esgotadas: true,
      nota: resultado.nota
    }
  }
  
  async function criarProximaTentativa(idUsuario, { id_exame, id_modulo } = {}) {
    let idExameReferencia = id_exame ? Number(id_exame) : null
  
    if (!idExameReferencia) {
      const idModulo = id_modulo ? Number(id_modulo) : null
      const ultimo = await findUltimoExameFinalizado(idUsuario, idModulo)
  
      if (!ultimo) {
        throw createHttpError(
          404,
          'Nenhuma tentativa finalizada encontrada para este modulo.'
        )
      }
  
      idExameReferencia = ultimo.id_exame
    }
  
    const exame = await insertProximaTentativa(idExameReferencia)
    return mapQuestoesResponse(exame)
  }
  
  async function buscarModuloAtual(idUsuario) {
    const modulo = await findModuloAtualByUsuario(idUsuario)
  
    if (!modulo) {
      throw createHttpError(404, 'Nenhum exame em andamento.')
    }
  
    return modulo
  }
  
  async function listarExamesUsuario(idUsuario) {
    return findExamesByUsuario(idUsuario)
  }
  
  module.exports = {
    iniciarModulo,
    buscarExameAtual,
    responderQuestao,
    criarProximaTentativa,
    buscarModuloAtual,
    listarExamesUsuario
  }