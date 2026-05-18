(function () {
  function queryParam(name) {
    return new URLSearchParams(window.location.search).get(name)
  }

  function renderResult(result) {
    var approved = Number(result.nota) >= 70
    var total = Number(result.total) || 0
    var acertos = Number(result.acertos) || 0
    var icon = document.querySelector('[data-result-icon]')

    icon.className = 'result-icon ' + (approved ? 'success' : 'danger')
    icon.textContent = approved ? 'OK' : 'X'

    document.querySelector('[data-result-title]').textContent = approved
      ? 'Parabens!'
      : 'Nao foi desta vez'

    var tentativaNumero = Number(result.tentativa || 1)
    document.querySelector('[data-result-message]').textContent = approved
      ? 'Modulo ' +
          result.id_modulo +
          ' — tentativa ' +
          tentativaNumero +
          ': voce foi aprovado com ' +
          result.nota +
          '%.'
      : 'Modulo ' +
          result.id_modulo +
          ' — tentativa ' +
          tentativaNumero +
          ': voce obteve ' +
          result.nota +
          '%. A nota minima e 70%.'

    document.querySelector('[data-result-score]').textContent =
      Number(result.nota || 0) + '%'
    document
      .querySelector('[data-result-score]')
      .classList.add(approved ? 'text-success' : 'text-danger')
    document.querySelector('[data-result-count]').textContent =
      acertos + ' de ' + total + ' questoes corretas'
    document.querySelector('[data-result-bar]').style.width =
      (total ? (acertos / total) * 100 : 0) + '%'
    document
      .querySelector('[data-result-bar]')
      .classList.add(approved ? 'success' : 'danger')
    document.querySelector('[data-correct-count]').textContent = acertos
    document.querySelector('[data-wrong-count]').textContent = total - acertos

    var actions = document.querySelector('.result-actions')
    if (!actions) return

    actions.querySelectorAll('[data-retry-exam]').forEach(function (node) {
      node.remove()
    })

    if (!approved && Number(result.tentativa) < 2) {
      var retryButton = document.createElement('button')
      retryButton.type = 'button'
      retryButton.className = 'button button-primary'
      retryButton.dataset.retryExam = 'true'
      retryButton.textContent = 'Tentar novamente'
      retryButton.addEventListener('click', async function () {
        retryButton.disabled = true
        try {
          const retry = await apiFetch('/api/questoes/proxima-tentativa', {
            method: 'PATCH',
            body: JSON.stringify({
              id_exame: result.id_exame,
              id_modulo: result.id_modulo
            })
          })
          if (!retry) return

          const data = await retry.json().catch(() => ({}))
          if (!retry.ok) {
            renderError(
              data.message || 'Nao foi possivel iniciar a nova tentativa.'
            )
            return
          }

          window.location.href =
            'exame.html?id_exame=' +
            encodeURIComponent(data.id_exame) +
            '&modulo=' +
            encodeURIComponent(result.id_modulo)
        } finally {
          retryButton.disabled = false
        }
      })
      actions.insertBefore(retryButton, actions.firstChild)
    }
  }

  function renderError(message) {
    document.querySelector('[data-result-title]').textContent =
      'Resultado indisponivel'
    document.querySelector('[data-result-message]').textContent = message
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (!tokenValido()) {
      requireAuth()
      return
    }

    try {
      const idExame = queryParam('id_exame')
      const idModulo = queryParam('modulo')
      let url = '/api/exames/resultado-atual'
      const params = []
      if (idExame) params.push('id_exame=' + encodeURIComponent(idExame))
      if (idModulo) params.push('modulo=' + encodeURIComponent(idModulo))
      if (params.length) url += '?' + params.join('&')

      const response = await apiFetch(url)

      if (!response) return

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        renderError(result.message || 'Nao foi possivel carregar o resultado.')
        return
      }

      renderResult(result)
    } catch (error) {
      console.error(error)
      renderError('Erro ao conectar com o servidor.')
    }
  })
})()
