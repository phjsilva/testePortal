/**
 * Módulo de Utilitários Gerais
 * Funções auxiliares de formatação usadas em múltiplos contextos
 */

/**
 * Formata uma string de data padrão ISO para o formato curto nacional.
 * Exemplo: "2026-06-08T01:23:45Z" -> "08/06/26"
 *
 * @param {string} dataStr - String de data em formato ISO.
 * @returns {string} Data formatada curta ou "---" se a entrada for inválida.
 */
function formatarDataCurta(dataStr) {
  if (!dataStr) return '---'
  try {
    const data = new Date(dataStr)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = String(data.getFullYear()).slice(-2)
    return `${dia}/${mes}/${ano}`
  } catch (erro) {
    console.error('Erro ao formatar data curta:', erro)
    return '---'
  }
}

/**
 * Formata uma string de data para exibição detalhada de emissão com horas.
 * Exemplo: "2026-06-08T15:30:00Z" -> "08/06/2026 - 15:30"
 *
 * @param {string} dataStr - String de data em formato ISO.
 * @returns {string} Data e hora formatadas ou "---".
 */
function formatarDataEmissao(dataStr) {
  if (!dataStr) return '---'
  try {
    const data = new Date(dataStr)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const horas = String(data.getHours()).padStart(2, '0')
    const minutos = String(data.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`
  } catch (erro) {
    console.error('Erro ao formatar data de emissão:', erro)
    return '---'
  }
}

/**
 * Formata uma string de CPF contendo apenas números no padrão nacional (###.###.###-##).
 * Caso o CPF não possua 11 dígitos, retorna o valor original sem formatação.
 *
 * @param {string} cpf - CPF limpo ou formatado.
 * @returns {string} CPF formatado ou original.
 */
function formatarCPF(cpf) {
  if (!cpf) return '---'
  const cpfLimpo = cpf.replace(/\D/g, '')
  if (cpfLimpo.length === 11) {
    return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9)}`
  }
  return cpf
}
/**
 * Módulo de Exportação de Certificado em PDF
 * Responsável pela captura e geração do arquivo PDF de alta definição
 */

// Armazena os dados do certificado para uso na exportação
let dadosCertificado = null

/**
 * Define os dados do certificado para posterior exportação
 * @param {Object} data - Objeto contendo os dados completos do certificado
 */
function definirDadosCertificado(data) {
  dadosCertificado = data
}

/**
 * Captura a área do certificado (#certificate-content) e realiza a exportação
 * para um arquivo PDF de alta definição no formato paisagem (A4) usando html2canvas e jsPDF.
 * O processo clona e isola o elemento para garantir proporções e alinhamentos ideais.
 *
 * Dependências externas necessárias:
 * - html2canvas (carregado via CDN)
 * - jsPDF (carregado via CDN)
 *
 * @returns {void}
 */
function exportarCertificadoParaPDF() {
  if (!dadosCertificado) {
    console.error('Dados do certificado não foram carregados.')
    return
  }

  const elementoCertificado = document.getElementById('certificate-content')
  const botaoDownload = document.getElementById('btn-download-pdf')

  if (!elementoCertificado) {
    console.error('Elemento #certificate-content não encontrado no DOM.')
    return
  }

  // Desabilita o botão temporariamente para evitar cliques duplos durante o processamento
  if (botaoDownload) {
    botaoDownload.disabled = true
    botaoDownload.textContent = 'Gerando PDF...'
  }

  // Configuração de captura com html2canvas de alta definição
  // Utiliza onclone para fixar as dimensões em 1120x778, independentemente da tela do usuário
  html2canvas(elementoCertificado, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 1120,
    height: 778,
    onclone: (clonedDoc) => {
      const clonedWrapper = clonedDoc.getElementById('certificate-wrapper')
      const clonedCert = clonedDoc.getElementById('certificate-content')

      // Define dimensões fixas no wrapper do certificado clonado
      if (clonedWrapper) {
        clonedWrapper.style.width = '1120px'
        clonedWrapper.style.maxWidth = '1120px'
        clonedWrapper.style.minWidth = '1120px'
        clonedWrapper.style.display = 'block'
      }

      // Remove transformações e propriedades que podem afetar o layout
      if (clonedCert) {
        clonedCert.style.width = '1120px'
        clonedCert.style.height = '778px'
        clonedCert.style.transform = 'none'
        clonedCert.style.margin = '0'
        clonedCert.style.position = 'relative'
        clonedCert.style.borderRadius = '0'
        clonedCert.style.boxShadow = 'none'
        clonedCert.style.display = 'block'
        clonedCert.style.containerType = 'inline-size'
      }
    }
  })
    .then((canvas) => {
      // Converte o canvas para imagem PNG
      const imgData = canvas.toDataURL('image/png')
      const { jsPDF } = window.jspdf

      // Cria um documento PDF no modo Paisagem (Landscape) A4 exato
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfLargura = 297
      const pdfAltura = 210 // Mantém a proporção 535:372 perfeita
      const yOffset = (210 - pdfAltura) / 2 // Centraliza verticalmente no A4

      // Insere o canvas renderizado centralizado verticalmente na folha A4
      pdf.addImage(
        imgData,
        'PNG',
        0,
        yOffset,
        pdfLargura,
        pdfAltura,
        undefined,
        'FAST'
      )

      // Cria um nome de arquivo amigável a partir do nome do aluno
      const nomeParticipanteSlug = dadosCertificado.aluno.nome
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')

      pdf.save(`certificado-${nomeParticipanteSlug}.pdf`)

      // Restaura o estado original do botão após a conclusão do download
      if (botaoDownload) {
        botaoDownload.disabled = false
        botaoDownload.textContent = 'Baixar PDF'
      }
    })
    .catch((erro) => {
      console.error('Erro ao gerar PDF do certificado:', erro)
      alert(
        'Não foi possível gerar o PDF. Por favor, utilize a função de impressão do seu navegador.'
      )

      // Restaura o botão em caso de erro
      if (botaoDownload) {
        botaoDownload.disabled = false
        botaoDownload.textContent = 'Baixar PDF'
      }
    })
}
/* ================================================================
 * A partir daqui apenas teste, apagar futuramente
 * ================================================================ */
function criarCaminhoOnduladoSelo(cx, cy, r, numScallops, depth) {
  const path = []
  const step = Math.PI / numScallops
  for (let i = 0; i < numScallops; i++) {
    const a1 = (2 * i - 1) * step
    const aPeak = 2 * i * step
    const a2 = (2 * i + 1) * step
    const rVal = r - depth
    const x1 = cx + rVal * Math.cos(a1),
      y1 = cy + rVal * Math.sin(a1)
    const xP = cx + r * Math.cos(aPeak),
      yP = cy + r * Math.sin(aPeak)
    const x2 = cx + rVal * Math.cos(a2),
      y2 = cy + rVal * Math.sin(a2)
    if (i === 0) path.push(`M ${x1.toFixed(2)} ${y1.toFixed(2)}`)
    path.push(
      `Q ${xP.toFixed(2)} ${yP.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`
    )
  }
  path.push('Z')
  return path.join(' ')
}

function gerarQRCodeValidador(hash) {
  const container = document.getElementById('qrcode-container')
  if (!container) return
  container.innerHTML = ''
  const url = `${window.location.origin}/certificado/${hash}`
  try {
    new QRCode(container, {
      text: url,
      width: 90,
      height: 90,
      colorDark: '#394353',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
  } catch (e) {
    console.error('QRCode falhou:', e)
  }
}

function popularTabelaNotas(modulosConcluidos, mediaFinal) {
  if (!modulosConcluidos) return
  for (let i = 1; i <= 5; i++) {
    const c = document.querySelector(`[data-grade-modulo-${i}]`)
    if (c) c.textContent = '---'
  }
  modulosConcluidos.forEach((mod) => {
    const id = Number(mod.id_modulo)
    const notas = mod.notasTentativas.map((t) => Number(t.nota || 0))
    const melhor = notas.length > 0 ? Math.max(...notas) : 0
    const cell = document.querySelector(`[data-grade-modulo-${id}]`)
    if (cell) cell.textContent = `${melhor}%`
  })
  const avg = document.querySelector('[data-grade-final-average]')
  if (avg) avg.textContent = `${Math.round(mediaFinal)}%`
}

function popularCamposDoCertificado(data) {
  definirDadosCertificado(data)

  document.querySelector('[data-certificate-name]').textContent =
    data.aluno.nome
  document.querySelector('[data-certificate-cpf]').textContent = formatarCPF(
    data.aluno.cpf
  )
  document.querySelector('[data-certificate-email]').textContent =
    data.aluno.email

  const ini = formatarDataCurta(data.certificado.inicioEm)
  const fim = formatarDataCurta(data.certificado.fimEm)
  document.querySelector('[data-certificate-period]').textContent =
    `${ini} a ${fim}`

  document.querySelector('[data-certificate-date]').textContent =
    formatarDataEmissao(data.certificado.emitidoEm)

  document.querySelectorAll('[data-certificate-hash]').forEach((el) => {
    el.textContent = data.certificado.certificadoHash
  })

  popularTabelaNotas(data.progresso.modulosConcluidos, data.mediaFinal)

  const scallopEl = document.getElementById('scallop-path')
  if (scallopEl)
    scallopEl.setAttribute('d', criarCaminhoOnduladoSelo(80, 80, 60, 42, 4.5))

  gerarQRCodeValidador(data.certificado.certificadoHash)
}

/* ── Inicialização ─────────────────────────────────────────────── */
async function init() {
  const loading = document.getElementById('loading-state')
  const wrapper = document.getElementById('certificate-wrapper')
  const errorState = document.getElementById('error-state')

  // Tenta pegar o hash da URL (ex: /certificado/a3f9c1...)
  const pathParts = window.location.pathname.split('/')
  const hashDaUrl = pathParts[pathParts.length - 1]

  if (!hashDaUrl || hashDaUrl === 'certificado.html') {
    loading.style.display = 'none'
    errorState.style.display = 'block'
    return
  }

  try {
    const response = await apiFetch(`/api/certificados/hash/${hashDaUrl}`)

    if (!response.ok) {
      throw new Error('Certificado não encontrado')
    }

    const data = await response.json()

    // RF07/RF08: Calcula a média baseada na melhor nota de cada módulo
    const notasFinaisPorModulo = data.progresso.modulosConcluidos.map((m) =>
      Math.max(...m.notasTentativas.map((n) => n.nota))
    )

    data.mediaFinal =
      notasFinaisPorModulo.reduce((a, b) => a + b, 0) /
      notasFinaisPorModulo.length

    popularCamposDoCertificado(data)

    loading.style.display = 'none'
    wrapper.style.display = 'flex'

    // Vincula todos os botões PDF
    document.querySelectorAll('.btn-pdf').forEach((btn) => {
      btn.addEventListener('click', () => {
        console.log('BOTÃO CLICADO')
        exportarCertificadoParaPDF()
      })
    })
  } catch (err) {
    console.error(err)
    loading.style.display = 'none'
    errorState.style.display = 'block'
    document.getElementById('error-message').textContent =
      err.message === 'Certificado não encontrado'
        ? 'Este certificado é inválido ou ainda não foi emitido.'
        : 'Erro de conexão com o servidor.'
  }
}

// DOM já está pronto (script ao final do body, CDN síncronos acima)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
