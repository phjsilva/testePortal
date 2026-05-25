const pool = require('../database/db')
const { randomBytes } = require('crypto')
const { hashPassword, verifyPassword } = require('../utils/password')

async function insertUsuarios(client, nome, email, cpf, senha) {
  const certificadoHash = randomBytes(24).toString('hex')
  const senhaCodificada = hashPassword(senha)

  const result = await client.query(
    `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_usuario, nome, email, cpf, certificado_hash`,
    [nome, email, cpf, senhaCodificada, certificadoHash]
  )

  return result.rows[0] || null
}

async function createUsuarios(nome, email, cpf, senha) {
  const client = await pool.connect()
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
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function updateUsuarioCPF(idUsuario, cpf) {
  const result = await pool.query(
    `UPDATE usuarios
      SET cpf = $1
      WHERE id_usuario = $2
      RETURNING id_usuario`,
    [cpf, idUsuario]
  )

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
      ) as total_aprovacoes,
      u.certificado_hash
    FROM usuarios u
    WHERE u.id_usuario = $1`,
    [idUsuario]
  )

  return result.rows[0] || null
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
  const cpfLimpo = cpf.replace(/\D/g, '')

  const result = await pool.query(
    `SELECT id_usuario, nome, email, cpf, senha
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
    throw new Error('Dados de login incorretos')
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
