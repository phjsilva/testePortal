const { Router } = require('express')
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
  findResultadoExameAtualByUsuario,
  findResultadoExame,
  findExamePorIdParaUsuario,
  inserirRespostaQuestao,
  atualizarRespostaQuestao,
  calcularNotaResposta,
  normalizarAlternativa,
  NOTA_MINIMA_APROVACAO,
  findExamesByUsuario
} = require('../repositories/questoes.repositories')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

function mapQuestoesResponse(exame) {
  return {
    ...exame,
    questoes: exame.questoes.map((questao) => ({
      ...questao,
      imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null
    }))
  }
}

router.post('/iniciar-modulo', authMiddleware, async function (req, res) {
  try {
    const idModulo = Number(req.body?.id_modulo)

    if (!idModulo) {
      return res.status(400).json({ message: 'id_modulo e obrigatorio.' })
    }

    const exame = await criarExameModulo(req.usuario.id_usuario, idModulo)
    return res.status(200).json(mapQuestoesResponse(exame))
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json({ message: error.message })
  }
})

router.get('/exame-atual', authMiddleware, async function (req, res) {
  try {
    const idModulo = req.query.modulo ? Number(req.query.modulo) : null
    const idExame = req.query.id_exame ? Number(req.query.id_exame) : null

    let exame = null

    if (idExame) {
      exame = await findQuestoesPorExame(idExame, req.usuario.id_usuario)
    } else {
      exame = await findQuestoesDoExameAtualByUsuario(
        req.usuario.id_usuario,
        idModulo
      )
    }

    if (!exame) {
      return res.status(404).json({
        message: 'Nenhum exame em andamento encontrado para este modulo.'
      })
    }

    return res.status(200).json(mapQuestoesResponse(exame))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.post('/responder', authMiddleware, async function (req, res) {
  try {
    const { id_exame, id_questao, resposta } = req.body

    if (!id_exame || !id_questao || !resposta) {
      return res.status(400).json({
        message: 'Exame, questao e resposta sao obrigatorios.'
      })
    }

    const respostaNormalizada = normalizarAlternativa(resposta)

    if (!['a', 'b', 'c', 'd'].includes(respostaNormalizada)) {
      return res.status(400).json({ message: 'Resposta invalida.' })
    }

    const exame = await findExamePorIdParaUsuario(
      id_exame,
      req.usuario.id_usuario
    )

    if (!exame) {
      return res.status(404).json({ message: 'Exame nao encontrado.' })
    }

    const questao = await findQuestaoDoExameByUsuario(
      req.usuario.id_usuario,
      id_exame,
      id_questao
    )

    if (!questao) {
      return res.status(404).json({
        message: 'Questao nao pertence a este exame ou modulo.'
      })
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

    let proximoEstado = null

    if (await usuarioConcluiuExame(id_exame)) {
      const resultado = await findResultadoExame(id_exame, req.usuario.id_usuario)
      const aprovado = Number(resultado?.nota ?? 0) >= NOTA_MINIMA_APROVACAO

      if (aprovado) {
        proximoEstado = {
          status: 'modulo_aprovado',
          id_exame,
          id_modulo: exame.id_modulo,
          nota: resultado.nota
        }
      } else if (Number(exame.tentativa) < 2) {
        proximoEstado = {
          status: 'modulo_concluido',
          id_exame,
          pode_tentar_novamente: true,
          nota: resultado.nota
        }
      } else {
        proximoEstado = {
          status: 'modulo_reprovado',
          id_exame,
          tentativas_esgotadas: true,
          nota: resultado.nota
        }
      }
    }

    return res.status(respostaExistente ? 200 : 201).json({
      ...respostaSalva,
      nota_questao: nota,
      proximo_estado: proximoEstado
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.patch('/proxima-tentativa', authMiddleware, async function (req, res) {
  try {
    const idExameBody = req.body?.id_exame ? Number(req.body.id_exame) : null
    let idExameReferencia = idExameBody

    if (!idExameReferencia) {
      const idModulo = req.body?.id_modulo
        ? Number(req.body.id_modulo)
        : null

      const ultimo = await findUltimoExameFinalizado(
        req.usuario.id_usuario,
        idModulo
      )

      if (!ultimo) {
        return res.status(404).json({
          message: 'Nenhuma tentativa finalizada encontrada para este modulo.'
        })
      }

      idExameReferencia = ultimo.id_exame
    }

    const exame = await insertProximaTentativa(idExameReferencia)
    return res.status(200).json(mapQuestoesResponse(exame))
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json({ message: error.message })
  }
})

router.get('/modulo-atual', authMiddleware, async function (req, res) {
  try {
    const modulo = await findModuloAtualByUsuario(req.usuario.id_usuario)
    if (!modulo) {
      return res.status(404).json({ message: 'Nenhum exame em andamento.' })
    }
    return res.status(200).json(modulo)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get('/exames', authMiddleware, async function (req, res) {
  try {
    const exames = await findExamesByUsuario(req.usuario.id_usuario)
    return res.status(200).json(exames)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router
