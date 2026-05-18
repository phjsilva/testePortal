const express = require('express')
require('dotenv').config({
  quiet: true
})
const path = require('path')
const router = require('./routes')

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const publicPath = path.join(__dirname, '..', 'public')
const pagesPath = path.join(publicPath, 'pages')
const assetsPath = path.join(publicPath, 'assets')
const cssPath = path.join(publicPath, 'css')
const jsPath = path.join(publicPath, 'js')

const imagensQuestoesPath = path.join(
  __dirname,
  'infra',
  'init',
  'seed-data',
  'imagens'
)

app.use('/', express.static(pagesPath))
app.use('/assets', express.static(assetsPath))
app.use('/css', express.static(cssPath))
app.use('/js', express.static(jsPath))

app.use('/imagens/questoes', express.static(imagensQuestoesPath))

app.use('/api', router)

app.use(function (req, res) {
  res.redirect('/404.html')
})
app.listen(PORT, function () {
  console.log(`Rodando em: http://localhost:${PORT}`)
})
