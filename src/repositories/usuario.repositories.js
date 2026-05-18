const { Result } = require('pg')
const pool = require('../database/db')
const { randomBytes } = require('crypto')
const { hashPassword, verifyPassword } = require('../utils/password')
const { error } = require('console')

async function insertUsuarios(client, nome, email, cpf, senha) {
  const certificado_hash = randomBytes(24).toString('hex')
  const senhaCodificada = hashPassword(senha)
  try {
    const result = await client.query(
      `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id_usuario, nome, email, cpf, certificado_hash`,
      [nome, email, cpf, senhaCodificada, certificado_hash]
    )

    if (result.rowCount === 1) {
      return result.rows[0]
    }

    return null
  } catch (e) {
    console.error('Erro ao inserir usuário:', e)
    throw e
  }
}

async function findPrimeiroModulo(client) {
  const result = await client.query(
    `SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`
  )

  if (result.rows.length === 1) {
    return result.rows[0]
  }

  return null
}

async function findGrupoAleatorio(client, idModulo) {
  const result = await client.query(
    `SELECT grupo
         FROM questoes
         WHERE id_modulo = $1 AND grupo IS NOT NULL
         ORDER BY RANDOM()
         LIMIT 1`,
    [idModulo]
  )

  if (result.rows.length === 1) {
    return result.rows[0]
  }

  return null
}

async function insertExame(client, idModulo, idUsuario, grupo, tentativa) {
  const result = await client.query(
    `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
         VALUES ($1, $2, $3, $4)
         RETURNING id_exame`,
    [idModulo, idUsuario, grupo, tentativa]
  )

  return result.rows[0] || null
}

async function createUsuarios(nome, email, cpf, senha) {
  const client = await pool.connect()

  // remove pontos e traço antes de salvar no banco
  const cpfLimpo = cpf.replace(/\D/g, '')

  try {
    await client.query('BEGIN')

    const usuario = await insertUsuarios(client, nome, email, cpfLimpo, senha)

    await client.query('COMMIT')

    return {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      certificado_hash: usuario.certificado_hash
    }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function updateUsuarioCPF(idUsuario, cpf) {
  console.log('Tentando conectar ao servido')
  const result = await pool.query(
    `UPDATE usuarios
         SET cpf = $1
         WHERE id_usuario = $2
         RETURNING id_usuario`,
    [cpf, idUsuario]
  )
  console.log('Update do cpf concluido')
  return result.rows[0] || null
}

async function findUsuarioById(idUsuario) {
  const result = await pool.query(
    `SELECT 
      u.id_usuario, u.nome, u.email, u.cpf,
      (SELECT id_modulo FROM exames WHERE id_usuario = u.id_usuario ORDER BY id_exame DESC LIMIT 1) as nivel_atual,
      (SELECT COUNT(*) FROM exames WHERE id_usuario = u.id_usuario) as total_tentativas,
      (
        SELECT COUNT(*) 
        FROM (
          SELECT id_exame 
          FROM respostas 
          GROUP BY id_exame 
          HAVING (SUM(nota)::float / COUNT(*)) * 100 >= 70
        ) as aprovados
        INNER JOIN exames e ON e.id_exame = aprovados.id_exame
        WHERE e.id_usuario = u.id_usuario
      ) as total_aprovacoes
      , u.certificado_hash
    FROM usuarios u
    WHERE u.id_usuario = $1`,
    [idUsuario]
  )
  return result.rows[0] || null
}

async function findUsuarioByCpfAndSenha(cpf, senha) {
  const result = await pool.query(
    `SELECT id_usuario, nome, email, cpf, senha, certificado_hash
      FROM usuarios 
      WHERE cpf = $1`,
    [cpf]
  )
  const usuario = result.rows[0]

  if (!usuario) {
    throw new Error('Usuário não encontrado.')
  }

  const senhaValida = verifyPassword(senha, usuario.senha)
  if (!senhaValida) {
    throw new Error('Senha inválida.')
  }

  return {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    certificado_hash: usuario.certificado_hash
  }
}

async function updateUsuarioNome(idUsuario, nome) {
  const result = await pool.query(
    `UPDATE usuarios
         SET nome = $1
         WHERE id_usuario = $2
         RETURNING id_usuario`,
    [nome, idUsuario]
  )
  return result.rows[0] || null
}

async function updateUsuarioEmail(idUsuario, email) {
  const result = await pool.query(
    `UPDATE usuarios
         SET email = $1
         WHERE id_usuario = $2
         RETURNING id_usuario`,
    [email, idUsuario]
  )
  return result.rows[0] || null
}

async function updateUsuarioSenha(idUsuario, senha) {
  const senhaCodificada = hashPassword(senha)
  const result = await pool.query(
    `UPDATE usuarios
         SET senha = $1
         WHERE id_usuario = $2
         RETURNING id_usuario`,
    [senhaCodificada, idUsuario]
  )
  return result.rows[0] || null
}

async function findUsuarioByCpfAndSenha(cpf, senha) {
  // remove máscara também na busca por CPF
  const cpfLimpo = cpf.replace(/\D/g, '')

  const result = await pool.query(
    `SELECT id_usuario,nome,email,cpf,senha
        FROM usuarios
        WHERE cpf = $1`,
    [cpfLimpo]
  )

  const usuario = result.rows[0]

  if (!usuario) {
    throw new Error('usuario inexistente')
  }
  const senhaValida = verifyPassword(senha, usuario.senha)

  if (!senhaValida) {
    throw Error('Dados de login incorretos')
  }

  return {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf
  }
}

module.exports = {
  createUsuarios,
  updateUsuarioCPF,
  findUsuarioById,
  updateUsuarioNome,
  updateUsuarioEmail,
  updateUsuarioSenha,
  findUsuarioByCpfAndSenha
}
