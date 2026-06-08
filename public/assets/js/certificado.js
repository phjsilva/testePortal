/**
 * Módulo de Validação e Exibição Pública de Certificados do Portal Scrum.
 * 
 * Este script é executado no carregamento da página de certificados públicos. Ele extrai
 * o hash identificador do certificado a partir da URL, faz a requisição à API para obter
 * os dados de conclusão do aluno, renderiza o layout responsivo do certificado com tabelas
 * de desempenho modular, gera o QR Code e oferece a funcionalidade de exportação em PDF.
 */

(function () {
    // Armazena os dados do certificado retornados pela API após o carregamento bem-sucedido.
    let dadosCertificado = null;

    /**
     * Formata uma string de data padrão ISO para o formato curto nacional.
     * Exemplo: "2026-06-08T01:23:45Z" -> "08/06/26"
     * 
     * @param {string} dataStr - String de data em formato ISO.
     * @returns {string} Data formatada curta ou "---" se a entrada for inválida.
     */
    function formatarDataCurta(dataStr) {
        if (!dataStr) return "---";
        try {
            const data = new Date(dataStr);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = String(data.getFullYear()).slice(-2);
            return `${dia}/${mes}/${ano}`;
        } catch (erro) {
            console.error("Erro ao formatar data curta:", erro);
            return "---";
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
        if (!dataStr) return "---";
        try {
            const data = new Date(dataStr);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
        } catch (erro) {
            console.error("Erro ao formatar data de emissão:", erro);
            return "---";
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
        if (!cpf) return "---";
        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length === 11) {
            return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9)}`;
        }
        return cpf;
    }

    /**
     * Extrai o hash identificador do certificado a partir da URL atual da página.
     * Suporta dois padrões de URL:
     * 1. Query parameter: /certificado?hash=HASH_AQUI
     * 2. Path parameter: /certificado/HASH_AQUI
     * 
     * @returns {string|null} O hash do certificado se encontrado, ou null.
     */
    function obterHashDaURL() {
        const pathSegments = window.location.pathname.split("/").filter(Boolean);
        
        // Verifica se o caminho contém o segmento '/certificado/' seguido de um hash no path.
        if (pathSegments.length > 1 && pathSegments[0] === "certificado") {
            return pathSegments[1];
        }
        
        // Caso não esteja no path, busca por parâmetro de query '?hash=...'
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("hash");
    }

    /**
     * Desenha o contorno ondulado (scallop) do selo usando curvas de Bézier quadráticas.
     * 
     * @param {number} cx - Centro X do selo.
     * @param {number} cy - Centro Y do selo.
     * @param {number} r - Raio externo máximo.
     * @param {number} numScallops - Número de ondulações/ondas.
     * @param {number} depth - Altura de recuo da onda.
     * @returns {string} Caminho SVG (atributo d).
     */
    function criarCaminhoOnduladoSelo(cx, cy, r, numScallops, depth) {
        const path = [];
        const step = Math.PI / numScallops;
        
        for (let i = 0; i < numScallops; i++) {
            const angleVal1 = (2 * i - 1) * step;
            const anglePeak = (2 * i) * step;
            const angleVal2 = (2 * i + 1) * step;
            
            const rVal = r - depth;
            
            const xVal1 = cx + rVal * Math.cos(angleVal1);
            const yVal1 = cy + rVal * Math.sin(angleVal1);
            
            const xPeak = cx + r * Math.cos(anglePeak);
            const yPeak = cy + r * Math.sin(anglePeak);
            
            const xVal2 = cx + rVal * Math.cos(angleVal2);
            const yVal2 = cy + rVal * Math.sin(angleVal2);
            
            if (i === 0) {
                path.push(`M ${xVal1.toFixed(2)} ${yVal1.toFixed(2)}`);
            }
            path.push(`Q ${xPeak.toFixed(2)} ${yPeak.toFixed(2)} ${xVal2.toFixed(2)} ${yVal2.toFixed(2)}`);
        }
        path.push('Z');
        return path.join(' ');
    }

    /**
     * Gera e insere o QR Code de validação no container HTML especificado.
     * O QR Code aponta para a URL pública atual onde qualquer pessoa externa pode
     * validar a veracidade das informações apresentadas.
     * 
     * @param {string} hash - Código identificador único do certificado.
     * @returns {void}
     */
    function gerarQRCodeValidador(hash) {
        const qrcodeContainer = document.getElementById("qrcode-container");
        if (!qrcodeContainer) return;
        
        // Limpa qualquer QR Code gerado anteriormente para evitar duplicação.
        qrcodeContainer.innerHTML = "";

        // Constrói a URL pública absoluta de verificação que será codificada no QR Code.
        const urlValidacao = `${window.location.origin}/certificado/${hash}`;

        try {
            // Instancia a biblioteca qrcode.js carregada via CDN.
            new QRCode(qrcodeContainer, {
                text: urlValidacao,
                width: 90,
                height: 90,
                colorDark: "#394353",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (erro) {
            console.error("Falha ao inicializar o QR Code:", erro);
        }
    }

    /**
     * Preenche as notas do aluno para cada módulo na tabela de desempenho acadêmico.
     * 
     * @param {Array} modulosConcluidos - Lista de módulos concluídos contendo notas de tentativas.
     * @param {number} mediaFinal - Média final acumulada do aluno no curso.
     * @returns {void}
     */
    function popularTabelaNotas(modulosConcluidos, mediaFinal) {
        if (!modulosConcluidos) return;

        // Limpa e reinicia os campos de notas dos 5 módulos.
        for (let i = 1; i <= 5; i++) {
            const cell = document.querySelector(`[data-grade-modulo-${i}]`);
            if (cell) cell.textContent = "---";
        }

        // Mapeia e insere a melhor nota de cada módulo na respectiva célula da tabela.
        modulosConcluidos.forEach((modulo) => {
            const idModulo = Number(modulo.id_modulo);
            const notas = modulo.notasTentativas.map((t) => Number(t.nota || 0));
            const melhorNota = notas.length > 0 ? Math.max(...notas) : 0;

            const cell = document.querySelector(`[data-grade-modulo-${idModulo}]`);
            if (cell) {
                cell.textContent = `${melhorNota}%`;
            }
        });

        // Preenche a célula de média final arredondada.
        const averageCell = document.querySelector("[data-grade-final-average]");
        if (averageCell) {
            averageCell.textContent = `${Math.round(mediaFinal)}%`;
        }
    }

    /**
     * Preenche os elementos do DOM da página com as informações reais do certificado
     * obtidas da API do servidor.
     * 
     * @param {Object} data - Objeto de resposta completo contendo os dados do certificado.
     * @returns {void}
     */
    function popularCamposDoCertificado(data) {
        dadosCertificado = data;

        // Preenchimento dos dados cadastrais do aluno participante.
        document.querySelector("[data-certificate-name]").textContent = data.aluno.nome;
        document.querySelector("[data-certificate-cpf]").textContent = formatarCPF(data.aluno.cpf);
        document.querySelector("[data-certificate-email]").textContent = data.aluno.email;

        // Formatação e inserção do período em que o curso foi realizado (Data de Início e Fim).
        const dataInicio = formatarDataCurta(data.certificado.inicioEm);
        const dataFim = formatarDataCurta(data.certificado.fimEm);
        document.querySelector("[data-certificate-period]").textContent = `${dataInicio} a ${dataFim}`;

        // Inserção da data detalhada de emissão e hash de segurança.
        document.querySelector("[data-certificate-date]").textContent = formatarDataEmissao(data.certificado.emitidoEm);
        
        // Garante o preenchimento de todas as ocorrências do hash identificador na página.
        document.querySelectorAll("[data-certificate-hash]").forEach((el) => {
            el.textContent = data.certificado.certificadoHash;
        });

        // Preenche a tabela de notas com os módulos e a média geral.
        popularTabelaNotas(data.progresso.modulosConcluidos, data.mediaFinal);

        // Desenha dinamicamente o contorno ondulado do selo roxo.
        const scallopPathEl = document.getElementById("scallop-path");
        if (scallopPathEl) {
            scallopPathEl.setAttribute("d", criarCaminhoOnduladoSelo(80, 80, 60, 42, 4.5));
        }

        // Geração do QR Code dinâmico apontando para esta página de verificação.
        gerarQRCodeValidador(data.certificado.certificadoHash);
    }

    /**
     * Captura a área do certificado (#certificate-content) e realiza a exportação
     * para um arquivo PDF de alta definição no formato paisagem (A4) usando html2canvas e jsPDF.
     * O processo clona e isola o elemento para garantir proporções e alinhamentos ideais.
     * 
     * @returns {void}
     */
    function exportarCertificadoParaPDF() {
        if (!dadosCertificado) return;

        const elementoCertificado = document.getElementById("certificate-content");
        const botaoDownload = document.getElementById("btn-download-pdf");

        // Desabilita o botão temporariamente para evitar cliques duplos durante o processamento.
        if (botaoDownload) {
            botaoDownload.disabled = true;
            botaoDownload.textContent = "Gerando PDF...";
        }

        // Configuração de captura com html2canvas de alta definição.
        // Utiliza onclone para fixar as dimensões em 1120x778, independentemente da tela do usuário.
        html2canvas(elementoCertificado, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            width: 1120,
            height: 778,
            onclone: (clonedDoc) => {
                const clonedWrapper = clonedDoc.getElementById("certificate-wrapper");
                const clonedCert = clonedDoc.getElementById("certificate-content");
                if (clonedWrapper) {
                    clonedWrapper.style.width = "1120px";
                    clonedWrapper.style.maxWidth = "1120px";
                    clonedWrapper.style.minWidth = "1120px";
                    clonedWrapper.style.display = "block";
                }
                if (clonedCert) {
                    clonedCert.style.width = "1120px";
                    clonedCert.style.height = "778px";
                    clonedCert.style.transform = "none";
                    clonedCert.style.margin = "0";
                    clonedCert.style.position = "relative";
                    clonedCert.style.borderRadius = "0";
                    clonedCert.style.boxShadow = "none";
                    clonedCert.style.display = "block";
                    clonedCert.style.containerType = "inline-size";
                }
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;

            // Cria um documento PDF no modo Paisagem (Landscape) A4 exato.
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const pdfLargura = 297;
            const pdfAltura = 206.5; // Mantém a proporção 535:372 perfeita
            const yOffset = (210 - pdfAltura) / 2; // Centraliza verticalmente no A4

            // Insere o canvas renderizado centralizado verticalmente na folha A4.
            pdf.addImage(imgData, "PNG", 0, yOffset, pdfLargura, pdfAltura);
            
            // Substitui espaços por hifens para construir um nome de arquivo amigável.
            const nomeParticipanteSlug = dadosCertificado.aluno.nome
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-");

            pdf.save(`certificado-${nomeParticipanteSlug}.pdf`);

            // Restaura o estado original do botão após a conclusão do download.
            if (botaoDownload) {
                botaoDownload.disabled = false;
                botaoDownload.textContent = "Baixar PDF";
            }
        }).catch((erro) => {
            console.error("Erro ao gerar PDF do certificado:", erro);
            alert("Não foi possível gerar o PDF. Por favor, utilize a função de impressão do seu navegador.");
            if (botaoDownload) {
                botaoDownload.disabled = false;
                botaoDownload.textContent = "Baixar PDF";
            }
        });
    }

    // Ponto de entrada executado ao carregar a estrutura do DOM.
    document.addEventListener("DOMContentLoaded", async () => {
        const loadingState = document.getElementById("loading-state");
        const errorState = document.getElementById("error-state");
        const certificateWrapper = document.getElementById("certificate-wrapper");
        const errorMessageEl = document.getElementById("error-message");
        const btnBack = document.getElementById("btn-back");

        // Ajusta a navegação de retorno (Voltar) com base no estado de autenticação do usuário.
        // Se o validador for um visitante externo, a ação direciona para a landing page.
        if (typeof tokenValido === "function" && tokenValido()) {
            btnBack.href = "/dashboard.html";
            btnBack.innerHTML = "&lt; Voltar ao Dashboard";
        } else {
            btnBack.href = "/";
            btnBack.innerHTML = "Acessar Portal Scrum";
        }

        const hash = obterHashDaURL();

        // Trata o caso em que nenhum hash foi fornecido na URL de acesso.
        if (!hash) {
            loadingState.style.display = "none";
            errorState.style.display = "block";
            errorMessageEl.textContent = "Nenhum código identificador de certificado foi fornecido.";
            return;
        }

        try {
            // Efetua a requisição assíncrona ao endpoint público de consulta por hash.
            const response = await fetch(`/api/certificados/hash/${hash}`);
            
            // Se o certificado for inexistente ou inválido, exibe a mensagem de erro retornada pelo servidor.
            if (!response.ok) {
                const erroData = await response.json().catch(() => ({}));
                throw new Error(erroData.message || "Certificado não encontrado ou inválido.");
            }

            const data = await response.json();
            
            // Popula os elementos do DOM e exibe o certificado na tela.
            popularCamposDoCertificado(data);

            loadingState.style.display = "none";
            certificateWrapper.style.display = "block";

            // Vincula o gatilho de geração de PDF ao clique do botão de download.
            document.getElementById("btn-download-pdf").addEventListener("click", exportarCertificadoParaPDF);

        } catch (error) {
            // Renderiza uma mensagem de erro na tela caso o módulo ou certificado não seja localizado
            console.error("Erro no carregamento do certificado:", error);
            loadingState.style.display = "none";
            errorState.style.display = "block";
            errorMessageEl.textContent = error.message || "Erro na conexão com o servidor. Tente novamente mais tarde.";
        }
    });
})();
