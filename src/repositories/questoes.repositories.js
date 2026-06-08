const pool = require('../database/db')
const {
  QUESTOES_POR_TENTATIVA,
  NOTA_MINIMA_APROVACAO,
  MAX_TENTATIVAS,
  normalizarAlternativa,
  calcularNotaResposta
} = require('../utils/calcule')

function mapQuestaoRow(row) {
  return {
    id_exame: row.id_exame,
    id_questao: row.id_questao,
    id_modulo: row.id_modulo,
    grupo: row.grupo,
    numero: row.numero,
    dificuldade: row.dificuldade,
    enunciado: row.enunciado,
    alternativa_a: row.alternativa_a,
    alternativa_b: row.alternativa_b,
    alternativa_c: row.alternativa_c,
    alternativa_d: row.alternativa_d,
    imagem: row.imagem,
    resposta: row.resposta ? String(row.resposta).trim() : null,
    nota: row.nota
  }
}

async function validarComposicaoGrupo(idModulo, grupo) {
  const result = await pool.query(
    `
      SELECT
        COUNT(*) FILTER (
          WHERE LOWER(TRIM(dificuldade)) IN ('facil', 'fácil')
        )::int AS facil,
        COUNT(*) FILTER (
          WHERE LOWER(TRIM(dificuldade)) IN ('medio', 'média', 'media')
        )::int AS medio,
        COUNT(*) FILTER (
          WHERE LOWER(TRIM(dificuldade)) IN ('dificil', 'difícil')
        )::int AS dificil,
        COUNT(*)::int AS total
      FROM questoes
      WHERE id_modulo = $1
        AND grupo IS NOT DISTINCT FROM $2
    `,
    [idModulo, grupo]
  )

  const row = result.rows[0]
  if (!row) return false

  return (
    row.total === QUESTOES_POR_TENTATIVA &&
    row.facil === 3 &&
    row.medio === 4 &&
    row.dificil === 3
  )
}

async function findGrupoDisponivelParaTentativa(usuarioId, idModulo) {
  const result = await pool.query(
    `
      SELECT q.grupo
      FROM questoes q
      WHERE q.id_modulo = $1
        AND q.grupo IS NOT NULL
        AND q.grupo NOT IN (
          SELECT e.grupo
          FROM exames e
          WHERE e.id_usuario = $2
            AND e.id_modulo = $1
            AND e.grupo IS NOT NULL
        )
      GROUP BY q.grupo
      ORDER BY RANDOM()
    `,
    [idModulo, usuarioId]
  )

  for (const row of result.rows) {
    if (await validarComposicaoGrupo(idModulo, row.grupo)) {
      return row.grupo
    }
  }

  return null
}

async function insertExame(idModulo, idUsuario, grupo, tentativa) {
  const result = await pool.query(
    `
      INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
      VALUES ($1, $2, $3, $4)
      RETURNING id_exame, id_modulo, id_usuario, grupo, tentativa
    `,
    [idModulo, idUsuario, grupo, tentativa]
  )
  return result.rows[0] || null
}

async function findExamePorIdParaUsuario(idExame, usuarioId) {
  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        e.id_usuario,
        e.grupo,
        e.tentativa,
        m.titulo
      FROM exames e
      INNER JOIN modulos m ON m.id_modulo = e.id_modulo
      WHERE e.id_exame = $1
        AND e.id_usuario = $2
      LIMIT 1
    `,
    [idExame, usuarioId]
  )
  return result.rows[0] || null
}

async function findExameEmAndamento(usuarioId, idModulo = null) {
  const params = [usuarioId]
  let filtroModulo = ''

  if (idModulo != null) {
    params.push(idModulo)
    filtroModulo = 'AND e.id_modulo = $2'
  }

  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        e.grupo,
        e.tentativa,
        m.titulo,
        COUNT(q.id_questao)::int AS total_questoes,
        COUNT(r.id_resposta)::int AS respondidas
      FROM exames e
      INNER JOIN modulos m ON m.id_modulo = e.id_modulo
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      WHERE e.id_usuario = $1
        ${filtroModulo}
      GROUP BY e.id_exame, e.id_modulo, e.grupo, e.tentativa, m.titulo
      HAVING COUNT(r.id_resposta) < COUNT(q.id_questao)
      ORDER BY e.id_exame DESC
      LIMIT 1
    `,
    params
  )

  return result.rows[0] || null
}

async function findUltimoExameFinalizado(usuarioId, idModulo = null) {
  const params = [usuarioId]
  let filtroModulo = ''

  if (idModulo != null) {
    params.push(idModulo)
    filtroModulo = 'AND e.id_modulo = $2'
  }

  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        e.grupo,
        e.tentativa,
        m.titulo
      FROM exames e
      INNER JOIN modulos m ON m.id_modulo = e.id_modulo
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      WHERE e.id_usuario = $1
        ${filtroModulo}
      GROUP BY e.id_exame, e.id_modulo, e.grupo, e.tentativa, m.titulo
      HAVING COUNT(r.id_resposta) >= COUNT(q.id_questao)
        AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
      ORDER BY e.id_exame DESC
      LIMIT 1
    `,
    params
  )

  return result.rows[0] || null
}

async function findQuestoesPorExame(idExame, usuarioId) {
  const exame = await findExamePorIdParaUsuario(idExame, usuarioId)
  if (!exame) return null

  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        e.grupo,
        e.tentativa,
        e.titulo,
        q.id_questao,
        q.numero,
        q.dificuldade,
        q.enunciado,
        q.alternativa_a,
        q.alternativa_b,
        q.alternativa_c,
        q.alternativa_d,
        q.imagem,
        r.resposta,
        r.nota
      FROM (
        SELECT
          ex.id_exame,
          ex.id_modulo,
          ex.grupo,
          ex.tentativa,
          m.titulo
        FROM exames ex
        INNER JOIN modulos m ON m.id_modulo = ex.id_modulo
        WHERE ex.id_exame = $1
          AND ex.id_usuario = $2
      ) e
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      ORDER BY q.numero ASC NULLS LAST, q.id_questao ASC
    `,
    [idExame, usuarioId]
  )

  if (!result.rows.length) return null

  const row = result.rows[0]

  return {
    id_exame: row.id_exame,
    id_modulo: row.id_modulo,
    grupo: row.grupo,
    tentativa: row.tentativa,
    titulo: row.titulo,
    questoes: result.rows.map(mapQuestaoRow)
  }
}

async function findQuestoesDoExameAtualByUsuario(usuarioId, idModulo = null) {
  const emAndamento = await findExameEmAndamento(usuarioId, idModulo)
  if (emAndamento) {
    return findQuestoesPorExame(emAndamento.id_exame, usuarioId)
  }

  if (idModulo != null) {
    return null
  }

  const ultimoFinalizado = await findUltimoExameFinalizado(usuarioId)
  if (!ultimoFinalizado) return null

  return findQuestoesPorExame(ultimoFinalizado.id_exame, usuarioId)
}

async function findQuestaoDoExameByUsuario(idUsuario, idExame, idQuestao) {
  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        q.id_questao,
        TRIM(q.alternativa_correta) AS alternativa_correta
      FROM exames e
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
        AND q.id_questao = $3
      WHERE e.id_usuario = $1
        AND e.id_exame = $2
      LIMIT 1
    `,
    [idUsuario, idExame, idQuestao]
  )
  return result.rows[0] || null
}

async function findRespostaByExameEQuestao(idExame, idQuestao) {
  const result = await pool.query(
    `
      SELECT
        id_resposta,
        id_exame,
        id_questao,
        TRIM(resposta) AS resposta,
        nota,
        respondido_em
      FROM respostas
      WHERE id_exame = $1
        AND id_questao = $2
      LIMIT 1
    `,
    [idExame, idQuestao]
  )
  return result.rows[0] || null
}

async function inserirRespostaQuestao(idExame, idQuestao, resposta, nota) {
  const result = await pool.query(
    `
      INSERT INTO respostas (id_exame, id_questao, resposta, nota)
      VALUES ($1, $2, $3, $4)
      RETURNING id_resposta, id_exame, id_questao, nota
    `,
    [idExame, idQuestao, resposta, nota]
  )
  return result.rows[0] || null
}

async function atualizarRespostaQuestao(idExame, idQuestao, resposta, nota) {
  const result = await pool.query(
    `
      UPDATE respostas
      SET resposta = $3,
          nota = $4,
          respondido_em = CURRENT_TIMESTAMP
      WHERE id_exame = $1
        AND id_questao = $2
      RETURNING id_resposta, id_exame, id_questao, nota
    `,
    [idExame, idQuestao, resposta, nota]
  )
  return result.rows[0] || null
}

async function usuarioConcluiuExame(idExame) {
  const result = await pool.query(
    `
      SELECT
        COUNT(q.id_questao)::int AS total,
        COUNT(r.id_resposta)::int AS respondidas
      FROM exames e
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      WHERE e.id_exame = $1
      GROUP BY e.id_exame
    `,
    [idExame]
  )

  const row = result.rows[0]
  if (!row) return false

  return (
    row.total === QUESTOES_POR_TENTATIVA &&
    row.respondidas >= row.total
  )
}

async function usuarioConcluiuModuloAtual(usuarioId) {
  const exame = await findExameEmAndamento(usuarioId)
  if (!exame) return false
  return usuarioConcluiuExame(exame.id_exame)
}

async function findModuloAtualByUsuario(usuarioId) {
  const exame = await findExameEmAndamento(usuarioId)
  if (!exame) return null

  return {
    id_exame: exame.id_exame,
    id_modulo: exame.id_modulo,
    titulo: exame.titulo,
    grupo: exame.grupo,
    tentativa: exame.tentativa,
    respondidas: exame.respondidas
  }
}

async function findResultadoExame(idExame, usuarioId) {
  const exame = await findExamePorIdParaUsuario(idExame, usuarioId)
  if (!exame) return null

  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        m.titulo,
        e.grupo,
        e.tentativa,
        COUNT(q.id_questao)::int AS total,
        COUNT(r.id_resposta)::int AS respondidas,
        COALESCE(SUM(r.nota), 0)::int AS acertos,
        CASE
          WHEN COUNT(q.id_questao) > 0
          THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
          ELSE 0
        END AS nota,
        (
          COUNT(r.id_resposta) >= COUNT(q.id_questao)
          AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
        ) AS concluido
      FROM exames e
      INNER JOIN modulos m ON m.id_modulo = e.id_modulo
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      WHERE e.id_exame = $1
        AND e.id_usuario = $2
      GROUP BY e.id_exame, e.id_modulo, m.titulo, e.grupo, e.tentativa
    `,
    [idExame, usuarioId]
  )

  return result.rows[0] || null
}

async function findResultadoExameAtualByUsuario(
  usuarioId,
  idExame = null,
  idModulo = null
) {
  if (idExame) {
    return findResultadoExame(idExame, usuarioId)
  }

  const ultimo = await findUltimoExameFinalizado(usuarioId, idModulo)
  if (!ultimo) return null

  return findResultadoExame(ultimo.id_exame, usuarioId)
}

async function moduloAnteriorAprovado(usuarioId, idModulo) {
  if (Number(idModulo) <= 1) return true

  const result = await pool.query(
    `
      SELECT BOOL_OR(concluida AND nota >= ${NOTA_MINIMA_APROVACAO}) AS aprovado
      FROM (
        SELECT
          e.id_exame,
          CASE
            WHEN COUNT(q.id_questao) > 0
            THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
            ELSE 0
          END AS nota,
          (
            COUNT(r.id_resposta) >= COUNT(q.id_questao)
            AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
          ) AS concluida
        FROM exames e
        INNER JOIN questoes q
          ON q.id_modulo = e.id_modulo
          AND q.grupo IS NOT DISTINCT FROM e.grupo
        LEFT JOIN respostas r
          ON r.id_exame = e.id_exame
          AND r.id_questao = q.id_questao
        WHERE e.id_usuario = $1
          AND e.id_modulo = $2
        GROUP BY e.id_exame
      ) tentativas
    `,
    [usuarioId, Number(idModulo) - 1]
  )

  return Boolean(result.rows[0]?.aprovado)
}

async function contarTentativasModulo(usuarioId, idModulo) {
  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM exames
      WHERE id_usuario = $1
        AND id_modulo = $2
    `,
    [usuarioId, idModulo]
  )

  return Number(result.rows[0]?.total ?? 0)
}

async function criarExameModulo(usuarioId, idModulo) {
  const idModuloNum = Number(idModulo)

  if (!(await moduloAnteriorAprovado(usuarioId, idModuloNum))) {
    const error = new Error('Modulo anterior ainda nao foi aprovado.')
    error.statusCode = 403
    throw error
  }

  const emAndamento = await findExameEmAndamento(usuarioId, idModuloNum)
  if (emAndamento) {
    return findQuestoesPorExame(emAndamento.id_exame, usuarioId)
  }

  const tentativasExistentes = await contarTentativasModulo(
    usuarioId,
    idModuloNum
  )

  const aprovadoAnterior = await pool.query(
    `
      SELECT BOOL_OR(concluida AND nota >= ${NOTA_MINIMA_APROVACAO}) AS aprovado
      FROM (
        SELECT
          CASE
            WHEN COUNT(q.id_questao) > 0
            THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
            ELSE 0
          END AS nota,
          (
            COUNT(r.id_resposta) >= COUNT(q.id_questao)
            AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
          ) AS concluida
        FROM exames e
        INNER JOIN questoes q
          ON q.id_modulo = e.id_modulo
          AND q.grupo IS NOT DISTINCT FROM e.grupo
        LEFT JOIN respostas r
          ON r.id_exame = e.id_exame
          AND r.id_questao = q.id_questao
        WHERE e.id_usuario = $1
          AND e.id_modulo = $2
        GROUP BY e.id_exame
      ) t
    `,
    [usuarioId, idModuloNum]
  )

  if (aprovadoAnterior.rows[0]?.aprovado) {
    const error = new Error('Voce ja foi aprovado neste modulo.')
    error.statusCode = 409
    throw error
  }

  if (tentativasExistentes >= MAX_TENTATIVAS) {
    const error = new Error('Limite de 2 tentativas atingido para este modulo.')
    error.statusCode = 409
    throw error
  }

  const grupo = await findGrupoDisponivelParaTentativa(usuarioId, idModuloNum)

  if (grupo == null) {
    const error = new Error(
      'Nenhum conjunto de questoes disponivel para este modulo.'
    )
    error.statusCode = 404
    throw error
  }

  const exame = await insertExame(
    idModuloNum,
    usuarioId,
    grupo,
    tentativasExistentes + 1
  )

  return findQuestoesPorExame(exame.id_exame, usuarioId)
}

async function insertProximaTentativa(idExameReferencia) {
  const referencia = await pool.query(
    `
      SELECT id_modulo, id_usuario, tentativa
      FROM exames
      WHERE id_exame = $1
    `,
    [idExameReferencia]
  )

  const base = referencia.rows[0]
  if (!base) return null

  const concluido = await usuarioConcluiuExame(idExameReferencia)
  if (!concluido) {
    const error = new Error(
      'Finalize todas as questoes da tentativa atual antes de tentar novamente.'
    )
    error.statusCode = 409
    throw error
  }

  const resultado = await findResultadoExame(
    idExameReferencia,
    base.id_usuario
  )

  if (Number(resultado?.nota ?? 0) >= NOTA_MINIMA_APROVACAO) {
    const error = new Error('Voce ja foi aprovado neste modulo.')
    error.statusCode = 409
    throw error
  }

  if (Number(base.tentativa) >= MAX_TENTATIVAS) {
    const error = new Error('Limite de 2 tentativas atingido.')
    error.statusCode = 409
    throw error
  }

  const emAndamento = await findExameEmAndamento(
    base.id_usuario,
    base.id_modulo
  )
  if (emAndamento) {
    return findQuestoesPorExame(emAndamento.id_exame, base.id_usuario)
  }

  const grupo = await findGrupoDisponivelParaTentativa(
    base.id_usuario,
    base.id_modulo
  )

  if (grupo == null) {
    const error = new Error(
      'Nenhum conjunto alternativo de questoes disponivel para este modulo.'
    )
    error.statusCode = 404
    throw error
  }

  const exame = await insertExame(
    base.id_modulo,
    base.id_usuario,
    grupo,
    Number(base.tentativa) + 1
  )

  return findQuestoesPorExame(exame.id_exame, base.id_usuario)
}

async function findProximoModuloByUsuario(idUsuario) {
  const result = await pool.query(
    `
      SELECT m.id_modulo, m.titulo
      FROM modulos m
      WHERE m.id_modulo > (
        SELECT COALESCE(MAX(e.id_modulo), 0)
        FROM exames e
        INNER JOIN (
          SELECT
            ex.id_exame,
            CASE
              WHEN COUNT(q.id_questao) > 0
              THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
              ELSE 0
            END AS nota,
            (
              COUNT(r.id_resposta) >= COUNT(q.id_questao)
              AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
            ) AS concluida
          FROM exames ex
          INNER JOIN questoes q
            ON q.id_modulo = ex.id_modulo
            AND q.grupo IS NOT DISTINCT FROM ex.grupo
          LEFT JOIN respostas r
            ON r.id_exame = ex.id_exame
            AND r.id_questao = q.id_questao
          WHERE ex.id_usuario = $1
          GROUP BY ex.id_exame
        ) avaliacoes ON avaliacoes.id_exame = e.id_exame
        WHERE avaliacoes.concluida
          AND avaliacoes.nota >= ${NOTA_MINIMA_APROVACAO}
      )
      ORDER BY m.id_modulo ASC
      LIMIT 1
    `,
    [idUsuario]
  )

  return result.rows[0]?.id_modulo || null
}

async function findExamesByUsuario(usuarioId) {
  const result = await pool.query(
    `
      WITH tentativas AS (
        SELECT
          e.id_exame,
          e.id_modulo,
          e.tentativa,
          COUNT(q.id_questao)::int AS total,
          COUNT(r.id_resposta)::int AS respondidas,
          COALESCE(SUM(r.nota), 0)::int AS acertos,
          CASE
            WHEN COUNT(q.id_questao) > 0
            THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
            ELSE 0
          END AS nota,
          (
            COUNT(r.id_resposta) >= COUNT(q.id_questao)
            AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
          ) AS concluida
        FROM exames e
        INNER JOIN questoes q
          ON q.id_modulo = e.id_modulo
          AND q.grupo IS NOT DISTINCT FROM e.grupo
        LEFT JOIN respostas r
          ON r.id_exame = e.id_exame
          AND r.id_questao = q.id_questao
        WHERE e.id_usuario = $1
        GROUP BY e.id_exame, e.id_modulo, e.tentativa
      ),
      agregados AS (
        SELECT
          id_modulo,
          COUNT(*)::int AS tentativas_iniciadas,
          COUNT(*) FILTER (WHERE concluida)::int AS tentativas_usadas,
          COALESCE(MAX(tentativa), 0)::int AS maior_tentativa,
          COALESCE(MAX(nota) FILTER (WHERE concluida), 0)::int AS melhor_nota,
          COALESCE((ARRAY_AGG(nota ORDER BY id_exame DESC) FILTER (WHERE concluida))[1], 0)::int AS ultima_nota,
          BOOL_OR(concluida AND nota >= ${NOTA_MINIMA_APROVACAO}) AS aprovado,
          BOOL_OR(NOT concluida) AS em_andamento
        FROM tentativas
        GROUP BY id_modulo
      )
      SELECT
        m.id_modulo AS nivel,
        m.titulo,
        COALESCE(a.tentativas_iniciadas, 0) AS tentativas_iniciadas,
        COALESCE(a.tentativas_usadas, 0) AS tentativas_usadas,
        COALESCE(a.maior_tentativa, 0) AS maior_tentativa,
        COALESCE(a.melhor_nota, 0) AS melhor_nota,
        COALESCE(a.ultima_nota, 0) AS ultima_nota,
        COALESCE(a.aprovado, false) AS aprovado,
        COALESCE(a.em_andamento, false) AS em_andamento,
        CASE
          WHEN COALESCE(a.aprovado, false) THEN 'concluido'
          WHEN m.id_modulo = 1 THEN 'disponivel'
          WHEN COALESCE(a_prev.aprovado, false) THEN 'disponivel'
          ELSE 'bloqueado'
        END AS status
      FROM modulos m
      LEFT JOIN agregados a ON a.id_modulo = m.id_modulo
      LEFT JOIN agregados a_prev ON a_prev.id_modulo = m.id_modulo - 1
      ORDER BY m.id_modulo
    `,
    [usuarioId]
  )
  return result.rows
}

async function countQuestoesRespondidasByUsuario(usuarioId) {
  const result = await pool.query(
    `
      SELECT COUNT(r.id_resposta)::int AS total
      FROM respostas r
      INNER JOIN exames e ON e.id_exame = r.id_exame
      WHERE e.id_usuario = $1
    `,
    [usuarioId]
  )
  return Number(result.rows[0]?.total ?? 0)
}

async function findModulosRespondidosByUsuario(idUsuario) {
  const result = await pool.query(
    `
      SELECT
        e.id_exame,
        e.id_modulo,
        e.tentativa,
        e.grupo,
        COUNT(q.id_questao)::int AS questoes,
        COUNT(r.id_resposta)::int AS questoes_respondidas,
        COALESCE(SUM(r.nota), 0)::int AS acertos,
        CASE
          WHEN COUNT(q.id_questao) > 0
          THEN ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100)::int
          ELSE 0
        END AS nota,
        MIN(r.respondido_em) AS inicio,
        MAX(r.respondido_em) AS fim
      FROM exames e
      INNER JOIN questoes q
        ON q.id_modulo = e.id_modulo
        AND q.grupo IS NOT DISTINCT FROM e.grupo
      LEFT JOIN respostas r
        ON r.id_exame = e.id_exame
        AND r.id_questao = q.id_questao
      WHERE e.id_usuario = $1
      GROUP BY e.id_exame, e.id_modulo, e.tentativa, e.grupo
      HAVING COUNT(r.id_resposta) >= COUNT(q.id_questao)
        AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
      ORDER BY e.id_modulo ASC, e.tentativa ASC
    `,
    [idUsuario]
  )

  return result.rows
}

async function jaExiste(idUsuario, idModulo) {
  return pool.query(
    `SELECT id_exame FROM exames WHERE id_usuario = $1 AND id_modulo = $2 LIMIT 1`,
    [idUsuario, idModulo]
  )
}

async function sincronizarDesbloqueioModulos(usuarioId) {
  return findExamesByUsuario(usuarioId)
}

module.exports = {
  QUESTOES_POR_TENTATIVA,
  NOTA_MINIMA_APROVACAO,
  MAX_TENTATIVAS,
  normalizarAlternativa,
  calcularNotaResposta,
  findProximaQuestaoByUsuario: async (usuarioId) => {
    const exame = await findExameEmAndamento(usuarioId)
    if (!exame) return null

    const result = await pool.query(
      `
        SELECT
          e.id_exame,
          q.id_questao,
          q.id_modulo,
          q.grupo,
          q.numero,
          q.dificuldade,
          q.enunciado,
          q.alternativa_a,
          q.alternativa_b,
          q.alternativa_c,
          q.alternativa_d,
          q.imagem
        FROM exames e
        INNER JOIN questoes q
          ON q.id_modulo = e.id_modulo
          AND q.grupo IS NOT DISTINCT FROM e.grupo
        WHERE e.id_exame = $1
          AND NOT EXISTS (
            SELECT 1
            FROM respostas r
            WHERE r.id_exame = e.id_exame
              AND r.id_questao = q.id_questao
          )
        ORDER BY q.numero ASC NULLS LAST, q.id_questao ASC
        LIMIT 1
      `,
      [exame.id_exame]
    )

    return result.rows[0] || null
  },
  findQuestoesDoExameAtualByUsuario,
  findQuestoesPorExame,
  findExamePorIdParaUsuario,
  findQuestaoDoExameByUsuario,
  findRespostaByExameEQuestao,
  inserirRespostaQuestao,
  atualizarRespostaQuestao,
  usuarioConcluiuModuloAtual,
  usuarioConcluiuExame,
  findModuloAtualByUsuario,
  findExameEmAndamento,
  findUltimoExameFinalizado,
  findResultadoExameAtualByUsuario,
  findResultadoExame,
  findGrupoDisponivelParaTentativa,
  insertProximaTentativa,
  criarExameModulo,
  findProximoModuloByUsuario,
  findExamesByUsuario,
  countQuestoesRespondidasByUsuario,
  findModulosRespondidosByUsuario,
  jaExiste,
  sincronizarDesbloqueioModulos,
  moduloAnteriorAprovado,
  contarTentativasModulo
}