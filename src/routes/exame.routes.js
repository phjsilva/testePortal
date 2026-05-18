const { Router } = require('express')
const {
  findResultadoExameAtualByUsuario,
  findResultadoExame,
  sincronizarDesbloqueioModulos
} = require('../repositories/questoes.repositories')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

router.get('/', authMiddleware, async function (req, res) {
  try {
    const exames = await sincronizarDesbloqueioModulos(req.usuario.id_usuario)
    return res.status(200).json(exames)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get('/resultado-atual', authMiddleware, async function (req, res) {
  try {
    const idExame = req.query.id_exame ? Number(req.query.id_exame) : null
    const idModulo = req.query.modulo ? Number(req.query.modulo) : null

    const resultado = await findResultadoExameAtualByUsuario(
      req.usuario.id_usuario,
      idExame,
      idModulo
    )

    if (!resultado) {
      return res.status(404).json({ message: 'Nenhum exame encontrado.' })
    }

    if (!resultado.concluido) {
      return res.status(409).json({
        message: 'Esta tentativa ainda nao foi finalizada.',
        id_exame: resultado.id_exame,
        id_modulo: resultado.id_modulo
      })
    }

    return res.status(200).json(resultado)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.get('/resultado/:idExame', authMiddleware, async function (req, res) {
  try {
    const idExame = Number(req.params.idExame)
    const resultado = await findResultadoExame(idExame, req.usuario.id_usuario)

    if (!resultado) {
      return res.status(404).json({ message: 'Exame nao encontrado.' })
    }

    if (!resultado.concluido) {
      return res.status(409).json({
        message: 'Esta tentativa ainda nao foi finalizada.'
      })
    }

    return res.status(200).json(resultado)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router
