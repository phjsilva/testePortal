// RF05: Cada tentativa tem 10 questões (3 fáceis, 4 médias, 3 difíceis)
const QUESTOES_POR_TENTATIVA = 10
// RF06: Nota mínima para aprovação é 70%
const NOTA_MINIMA_APROVACAO = 70
// RF07: Máximo de 2 tentativas por módulo
const MAX_TENTATIVAS = 2

// Remove espaços e converte para minúsculo para evitar divergências na comparação de respostas
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