const QUESTOES_POR_TENTATIVA = 10
const NOTA_MINIMA_APROVACAO = 70
const MAX_TENTATIVAS = 2

function normalizarAlternativa(valor) {
  return String(valor || '')
    .trim()
    .toLowerCase()
}

function calcularNotaResposta(alternativaCorreta, resposta) {
  return normalizarAlternativa(alternativaCorreta) ===
    normalizarAlternativa(resposta)
    ? 1
    : 0
}

module.exports = {
  QUESTOES_POR_TENTATIVA,
  NOTA_MINIMA_APROVACAO,
  MAX_TENTATIVAS,
  normalizarAlternativa,
  calcularNotaResposta
}