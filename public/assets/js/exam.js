;(function () {
  let exameAtual = null
  let questoes = []
  let respostas = {}
  let currentQuestion = 0
  let salvando = false

  function queryParam(name) {
    return new URLSearchParams(window.location.search).get(name)
  }

  function updateHeader() {
    const totalQuestoes = questoes.length || 1
    const count = document.querySelector('[data-question-count]')
    const progress = document.querySelector('[data-exam-progress]')

    if (count) {
      count.textContent = `Questao ${currentQuestion + 1} de ${totalQuestoes}`
    }

    if (progress) {
      progress.style.width = `${((currentQuestion + 1) / totalQuestoes) * 100}%`
    }
  }

  function questaoAtual() {
    return questoes[currentQuestion]
  }

  function normalizarDificuldade(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  function rotuloDificuldade(valor) {
    const nivel = normalizarDificuldade(valor)
    if (nivel.includes('facil')) return 'Fácil'
    if (nivel.includes('dificil')) return 'Difícil'
    if (nivel.includes('medio') || nivel.includes('media')) return 'Mèdio'
    return valor ? String(valor) : 'N/A'
  }

  function classeDificuldade(valor) {
    const nivel = normalizarDificuldade(valor)
    if (nivel.includes('facil')) return 'easy'
    if (nivel.includes('dificil')) return 'hard'
    return 'medium'
  }

  function renderQuestion() {
    const questao = questaoAtual()
    const shell = document.querySelector('[data-question-shell]')

    if (!questao || !shell) return

    const respostaSelecionada = respostas[questao.id_questao]
    const dificuldadeClasse = classeDificuldade(questao.dificuldade)
    const dificuldadeRotulo = rotuloDificuldade(questao.dificuldade)

    shell.innerHTML = `
      <div class="question-card-top">
        <div class="eyebrow">
          Questão ${currentQuestion + 1} de ${questoes.length}
        </div>
        <span class="difficulty-badge difficulty-${dificuldadeClasse}" title="Dificuldade: ${dificuldadeRotulo}">
          ${dificuldadeRotulo}
        </span>
      </div>

      <h2>${questao.enunciado}</h2>

      ${
        questao.imagem
          ? `
            <img
              src="${questao.imagem}"
              class="question-image"
              alt="Imagem da questao"
            />
          `
          : ''
      }

      <div class="answers">
        ${['a', 'b', 'c', 'd']
          .map((letra) => {
            const texto = questao[`alternativa_${letra}`]
            if (!texto) return ''
            return `
              <button
                class="answer-option ${respostaSelecionada === letra ? 'is-selected' : ''}"
                data-answer="${letra}"
                type="button"
              >
                <span class="answer-radio"></span>
                <span>${texto}</span>
              </button>
            `
          })
          .join('')}
      </div>

      <div class="exam-nav section-tight">
        <button class="button button-outline" type="button" data-prev-question>
          Voltar questao
        </button>
        <button class="button button-primary" type="button" data-next-question>
          ${currentQuestion === questoes.length - 1 ? 'Finalizar exame' : 'Proxima questao'}
        </button>
      </div>
    `

    shell.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', function () {
        respostas[questao.id_questao] = button.dataset.answer
        renderQuestion()
      })
    })

    const prevButton = shell.querySelector('[data-prev-question]')
    const nextButton = shell.querySelector('[data-next-question]')

    prevButton.disabled = currentQuestion === 0 || salvando
    nextButton.disabled = salvando

    prevButton.addEventListener('click', function () {
      if (currentQuestion === 0) return
      currentQuestion--
      renderQuestion()
    })

    nextButton.addEventListener('click', async function () {
      await avancarQuestao()
    })

    updateHeader()
  }

  async function carregarExame() {
    try {
      const idExame = queryParam('id_exame')
      const modulo = queryParam('modulo')
      let url = '/api/questoes/exame-atual'

      if (idExame) {
        url += '?id_exame=' + encodeURIComponent(idExame)
      } else if (modulo) {
        url += '?modulo=' + encodeURIComponent(modulo)
      }

      const res = await apiFetch(url)

      if (!res) return

      if (res.status === 404) {
        mostrarErro(
          'Nenhum exame em andamento. Volte aos módulos e inicie a prova.'
        )
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        mostrarErro(data.message || 'Não foi possível carregar o exame.')
        return
      }

      exameAtual = await res.json()
      questoes = exameAtual.questoes || []
      respostas = questoes.reduce((acc, questao) => {
        if (questao.resposta) acc[questao.id_questao] = questao.resposta
        return acc
      }, {})

      if (!questoes.length) {
        mostrarErro('Nenhuma questão foi encontrada para este exame.')
        return
      }

      if (modulo && Number(exameAtual.id_modulo) !== Number(modulo)) {
        mostrarErro('O exame carregado não corresponde ao módulo selecionado.')
        return
      }

      const primeiraPendente = questoes.findIndex(
        (questao) => !respostas[questao.id_questao]
      )

      if (primeiraPendente === -1) {
        finalizarAvaliacao()
        return
      }

      currentQuestion = primeiraPendente
      renderQuestion()
    } catch (err) {
      console.error('Erro ao carregar exame:', err)
      mostrarErro('Nao foi possivel carregar o exame.')
    }
  }

  async function salvarRespostaAtual() {
    const questao = questaoAtual()
    const resposta = respostas[questao.id_questao]

    if (!resposta) {
      mostrarAviso('Selecione uma alternativa antes de continuar.')
      return false
    }

    try {
      salvando = true
      renderQuestion()

      const res = await apiFetch('/api/questoes/responder', {
        method: 'POST',
        body: JSON.stringify({
          id_exame: exameAtual.id_exame,
          id_questao: questao.id_questao,
          resposta
        })
      })

      if (!res) return false

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        mostrarErro(data.message || 'Erro ao registrar resposta.')
        return false
      }

      questao.resposta = resposta
      questao.nota = data.nota_questao

      return true
    } catch (err) {
      console.error('Erro ao salvar resposta:', err)
      mostrarErro('Erro ao registrar resposta.')
      return false
    } finally {
      salvando = false
    }
  }

  async function avancarQuestao() {
    const salvo = await salvarRespostaAtual()
    if (!salvo) return

    if (currentQuestion < questoes.length - 1) {
      currentQuestion++
      renderQuestion()
      return
    }

    finalizarAvaliacao()
  }

  function finalizarAvaliacao() {
    if (!exameAtual?.id_exame) {
      window.location.href = 'modulos.html'
      return
    }

    const progress = document.querySelector('[data-exam-progress]')
    const count = document.querySelector('[data-question-count]')

    if (progress) progress.style.width = '100%'
    if (count) count.textContent = 'Avaliação concluído'

    window.location.href =
      'resultado.html?id_exame=' + encodeURIComponent(exameAtual.id_exame)
  }

  function mostrarAviso(msg) {
    const shell = document.querySelector('[data-question-shell]')
    if (!shell) return

    const alerta = shell.querySelector('[data-exam-alert]')
    if (alerta) {
      alerta.textContent = msg
      return
    }

    const div = document.createElement('div')
    div.className = 'alert alert-error is-visible'
    div.dataset.examAlert = 'true'
    div.textContent = msg
    shell.appendChild(div)
  }

  function mostrarErro(msg) {
    const shell = document.querySelector('[data-question-shell]')
    if (!shell) return

    shell.innerHTML = `
      <div class="exam-error">
        <h2>Erro</h2>
        <p>${msg}</p>
        <a class="button button-primary" href="modulos.html">Voltar aos modulos</a>
      </div>
    `
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (!tokenValido()) {
      requireAuth()
      return
    }

    await carregarExame()
  })
})()