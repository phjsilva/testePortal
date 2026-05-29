const {
    createUsuarios,
    updateUsuarioCPF,
    findUsuarioById,
    updateUsuarioNome,
    updateUsuarioEmail,
    updateUsuarioSenha
  } = require('../repositories/usuario.repositories')
  const { createHttpError } = require('../utils/http-error')
  
  function validarSenha(senha) {
    if (!senha) {
      throw createHttpError(400, 'Senha obrigatoria')
    }
  
    if (senha.trim().length < 6) {
      throw createHttpError(400, 'Senha deve ter pelo menos 6 caracteres')
    }
  }
  
  async function criarUsuario({ nome, email, cpf, senha } = {}) {
    if (!nome || !email || !cpf || !senha) {
      throw createHttpError(400, 'Nome, email, CPF e senha sao obrigatorios')
    }
  
    validarSenha(senha)
    return createUsuarios(nome, email, cpf, senha)
  }
  
  async function buscarUsuarioLogado(idUsuario) {
    const usuario = await findUsuarioById(idUsuario)
  
    if (!usuario) {
      throw createHttpError(404, 'Usuario nao encontrado.')
    }
  
    return usuario
  }
  
  async function atualizarUsuario(idUsuario, campo, valor) {
    const atualizadores = {
      cpf: {
        obrigatorio: 'CPF obrigatorio',
        duplicado: 'Ja existe usuario com o CPF informado',
        executar: updateUsuarioCPF
      },
      nome: {
        obrigatorio: 'Nome obrigatorio',
        executar: updateUsuarioNome
      },
      email: {
        obrigatorio: 'E-mail obrigatorio',
        duplicado: 'Ja existe usuario com o e-mail informado',
        executar: updateUsuarioEmail
      },
      senha: {
        obrigatorio: 'Senha obrigatoria',
        executar: updateUsuarioSenha
      }
    }
  
    const config = atualizadores[campo]
  
    if (!config) {
      throw createHttpError(400, 'Campo invalido')
    }
  
    if (!valor) {
      throw createHttpError(400, config.obrigatorio)
    }
  
    if (campo === 'senha') {
      validarSenha(valor)
    }
  
    try {
      const result = await config.executar(idUsuario, valor)
  
      if (!result) {
        throw createHttpError(404, 'Usuario nao encontrado')
      }
  
      return buscarUsuarioLogado(result.id_usuario)
    } catch (error) {
      if (error && error.code === '23505' && config.duplicado) {
        throw createHttpError(409, config.duplicado)
      }
  
      throw error
    }
  }
  
  module.exports = {
    criarUsuario,
    buscarUsuarioLogado,
    atualizarUsuario
  }