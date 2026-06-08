const pool = require('../database/db')
const {
  findModulosRespondidosByUsuario
} = require('../repositories/questoes.repositories')
const {
  NOTA_MINIMA_APROVACAO
} = require('../utils/calcule')

async function findUsuarioByCertificadoHash(certificadoHash) {
  const result = await pool.query(
    `SELECT id_usuario, nome, cpf, email,certificado_hash
      FROM usuarios 
      WHERE certificado_hash = $1`,
    [certificadoHash]
  )
  return result.rows[0] || null
}

async function findModulos() {
  const result = await pool.query(
    `SELECT id_modulo, titulo FROM modulos m ORDER BY id_modulo ASC`
  )
  return result.rows
}

function groupTentativasByModulo(tentativas) {
  return tentativas.reduce((groups, tentativa) => {
    const idModulo = Number(tentativa.id_modulo)

    if (!groups.has(idModulo)) {
      groups.set(idModulo, [])
    }

    groups.get(idModulo).push(tentativa)

    return groups
  }, new Map())
}

function mapModulo(modulo, tentativas) {
  return {
    id_modulo: modulo.id_modulo,
    titulo: modulo.titulo,
    metaQuestoes: Number(tentativas[0]?.questoes) || 0,
    notasTentativas: tentativas.map((tentativa) => ({
      nota: Number(tentativa.nota) || 0,
      metaQuestoes: Number(tentativa.questoes) || 0,
      tentativa: tentativa.tentativa,
      concluida:
        Number(tentativa.questoes_respondidas) >= Number(tentativa.questoes),
      inicioEm: tentativa.inicio,
      fimEm: tentativa.fim
    }))
  }
}

function getCertificatePeriod(modulosConcluidos) {
  const dates = modulosConcluidos
    .flatMap((modulo) => modulo.notasTentativas)
    .filter((tentativa) => tentativa.concluida)
    .flatMap((tentativa) => [tentativa.inicioEm, tentativa.fimEm])
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  return {
    inicioEm: dates[0]?.toISOString() || null,
    fimEm: dates[dates.length - 1]?.toISOString() || null
  }
}

async function gerarMediaFinal(id_usuario){
  try{
    const response = await pool.query(`SELECT ROUND(AVG(r.nota) * 100, 2) AS media_certificado
                              FROM exames e
                              JOIN respostas r
                                  ON r.id_exame = e.id_exame
                              WHERE e.id_usuario =${id_usuario}`)
  if(!response){

    return {"message":"Certificado inexistente"};
    
  }
  return response.rows[0];
  

  }catch(error){
    return {"message":"erro do servidor"}
  }

}

async function findCertificadoByHash(certificadoHash) {
  const usuario = await findUsuarioByCertificadoHash(certificadoHash)

  if (!usuario) {
    return null
  }

  const modulosRows = await findModulos()
  const tentativas = await findModulosRespondidosByUsuario(usuario.id_usuario)
  const tentativasByModulo = groupTentativasByModulo(tentativas)
  const modulos = []
  const modulosConcluidos = []

  for (const moduloRow of modulosRows) {
    const idModulo = Number(moduloRow.id_modulo)
    const tentativasDoModulo = tentativasByModulo.get(idModulo) || []
    const modulo = mapModulo(moduloRow, tentativasDoModulo)

    modulos.push(modulo)

    let moduloConcluido = false

    for (const tentativa of modulo.notasTentativas) {
      if (tentativa.concluida && Number(tentativa.nota) >= NOTA_MINIMA_APROVACAO) {
          moduloConcluido = true
          break
      }
    }

    if (moduloConcluido) {
      modulosConcluidos.push(modulo)
    }
  }

  if (!modulos.length || modulosConcluidos.length !== modulos.length) {
    return {
      indisponivel: true,
      motivo:
        'Certificado indisponivél: Conclusão de todos os módulos obrigatória.'
    }
  }
  
  const periodo = getCertificatePeriod(modulosConcluidos)
  const mediaFinal = await gerarMediaFinal(usuario.id_usuario)
  return {
    aluno: {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email:usuario.email
    },
    certificado: {
      certificadoHash: usuario.certificado_hash,
      codigoValidacao: usuario.certificado_hash,
      emitidoEm: periodo.fimEm,
      inicioEm: periodo.inicioEm,
      fimEm: periodo.fimEm
    },
    progresso: {
      modulosConcluidos
    },
    mediaFinal: parseFloat(mediaFinal.media_certificado)
  }
}

module.exports = {
  findCertificadoByHash
}