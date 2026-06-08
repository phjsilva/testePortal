// Nota mínima para considerar um módulo aprovado
const PASSING_AVERAGE = 70;

// Mapa de seletores CSS usados para acessar elementos do HTML
const selectors = {
  modulesComplete: "[data-modules-complete]",
  bestGrade: "[data-best-grade]",
  lastGrade: "[data-last-grade]",
  averageGrade: "[data-average-grade]",
  generalProgress: "[data-general-progress]",
  generalPercent: "[data-general-percent]",
  dashboardProgress: "[data-dashboard-progress]",
  dashboardStatus: "[data-dashboard-status]",
  taskSummary: "[data-task-summary]",
  taskPercent: "[data-task-percent]",
  taskBar: "[data-task-bar]",
  taskList: "[data-task-list]",
  certificateCta: "[data-certificate-cta]",
};

// Atalho para document.querySelector
const $ = (selector) => document.querySelector(selector);

// Arredonda e formata um número como percentual (ex: 75 → "75%")
const formatPercent = (value) => Math.round(value) + "%";

// Garante que o valor fique entre 0 e 100
const clampPercent = (value) => Math.max(0, Math.min(100, Number(value || 0)));

// Converte o objeto cru da API para o formato usado pelo dashboard
const normalizeModule = (module) => {
  const bestGrade = Number(module.melhor_nota || 0);
  const lastGrade = Number(module.ultima_nota || 0);

  return {
    id: Number(module.nivel),
    nome: module.titulo || "Modulo " + module.nivel,
    status: module.status,
    // melhor nota válida, ou null se ainda não tem nota
    nota: bestGrade || null,
    ultimaNota: lastGrade,
    percentualAcertos: clampPercent(bestGrade || lastGrade),
    // usa o maior valor entre os três campos de tentativas que a API retorna
    tentativasUsadas: Math.max(
      Number(module.tentativas_iniciadas || 0),
      Number(module.tentativas_usadas || 0),
      Number(module.maior_tentativa || 0),
    ),
    tentativas: 2,
  };
};

// Calcula as estatísticas gerais a partir da lista de módulos
const stats = (modules) => {
  // módulos com status "concluido"
  const complete = modules.filter((m) => m.status === "concluido").length;

  // notas dos módulos que já têm resultado
  const notes = modules.filter((m) => m.nota !== null).map((m) => m.nota);

  const best = notes.length ? Math.max(...notes) : 0;

  // último módulo que teve alguma nota (percorre de trás pra frente)
  const lastModule = [...modules].reverse().find((m) => m.ultimaNota > 0);
  const last = lastModule ? lastModule.ultimaNota : 0;

  const average = notes.length
    ? Math.round(notes.reduce((sum, n) => sum + n, 0) / notes.length)
    : 0;

  // progresso geral: percentual de módulos concluídos
  const progress = modules.length ? (complete / modules.length) * 100 : 0;

  return { complete, best, last, average, progress };
};

// Retorna o percentual de acertos de um módulo (entre 0 e 100)
const moduleProgressPercent = (module) =>
  clampPercent(module.percentualAcertos);

// Um módulo é considerado "encerrado" na barra se foi aprovado ou esgotou as tentativas
const isModuleProgressComplete = (module, progress) =>
  progress >= PASSING_AVERAGE || module.tentativasUsadas >= module.tentativas;

// Monta a lista de tarefas necessárias para emitir o certificado
const buildTasks = (modules, user, average) => {
  // uma task por módulo
  const tasks = modules.map((m) => [
    "Complete o " + m.nome,
    m.status === "concluido",
  ]);

  // tasks extras além dos módulos
  tasks.push([
    "Atinja media geral de " + PASSING_AVERAGE + "% ou superior",
    average >= PASSING_AVERAGE,
  ]);
  tasks.push(["Preencha seus dados no perfil", Boolean(user && user.nome)]);

  return tasks;
};

// Aplica a largura das barras de progresso via data-width (necessário porque CSS não lê atributos diretamente)
const updateProgressBars = (containerSelector) => {
  document
    .querySelectorAll(containerSelector + " [data-width]")
    .forEach((bar) => {
      bar.style.width = bar.dataset.width + "%";
    });
};

// Gera o HTML de uma linha de progresso por módulo
const moduleProgressTemplate = (module) => {
  const progress = moduleProgressPercent(module);
  // barra fica verde se o módulo foi encerrado (aprovado ou tentativas esgotadas)
  const barClass = isModuleProgressComplete(module, progress) ? "success" : "";
  const progressLabel = progress > 0 ? formatPercent(progress) : "";

  return `
    <div class="module-progress-row">
      <strong>${module.nome}</strong>
      <div class="module-progress-details">
        <div class="progress">
          <div class="progress-bar ${barClass}" data-width="${progress}"></div>
        </div>
        <span class="module-progress-percent">${progressLabel}</span>
      </div>
    </div>`;
};

// Define a classe do badge de acordo com o status do módulo
const statusBadgeClass = (status) => {
  if (status === "concluido") return "badge-success";
  if (status === "disponivel") return "badge-primary";
  return "badge-muted";
};

// Gera o HTML de um item de status por módulo
const moduleStatusTemplate = (module) => `
  <div class="status-item">
    <span class="badge ${statusBadgeClass(module.status)}">${module.status}</span>
    <div>
      <strong>${module.nome}</strong>
      <p class="muted">${module.tentativasUsadas}/${module.tentativas} tentativas usadas</p>
    </div>
  </div>`;

// Gera o HTML de uma task (concluída ou pendente)
const taskTemplate = (task) => `
  <div class="task-item ${task[1] ? "is-done" : ""}">
    <span>${task[1] ? "OK" : "--"}</span>
    <span>${task[0]}</span>
  </div>`;

// Renderiza a seção de progresso por módulo
const renderProgress = (modules) => {
  $(selectors.dashboardProgress).innerHTML = modules
    .map(moduleProgressTemplate)
    .join("");
  updateProgressBars(selectors.dashboardProgress);
};

// Renderiza a seção de status dos módulos
const renderStatus = (modules) => {
  $(selectors.dashboardStatus).innerHTML = modules
    .map(moduleStatusTemplate)
    .join("");
};

// Renderiza a seção de tasks do certificado
const renderTasks = (modules, user, average) => {
  const tasks = buildTasks(modules, user, average);
  const done = tasks.filter((t) => t[1]).length;
  const percent = tasks.length ? (done / tasks.length) * 100 : 0;

  $(selectors.taskSummary).textContent =
    done + " de " + tasks.length + " tarefas concluidas";
  $(selectors.taskPercent).textContent = formatPercent(percent);
  $(selectors.taskBar).style.width = percent + "%";
  $(selectors.taskList).innerHTML = tasks.map(taskTemplate).join("");
};

// Renderiza os cards de resumo do topo (módulos, melhor nota, última nota, média)
const renderSummary = (modules, data) => {
  $(selectors.modulesComplete).textContent =
    data.complete + "/" + modules.length;
  $(selectors.bestGrade).textContent = data.best + "%";
  $(selectors.lastGrade).textContent = data.last + "%";
  $(selectors.averageGrade).textContent = data.average + "%";
  $(selectors.generalProgress).style.width = data.progress + "%";
  $(selectors.generalPercent).textContent = formatPercent(data.progress);
};

// Renderiza o CTA do certificado (aprovado ou incentivo para continuar)
const renderCertificateCta = (modules, data) => {
  const canIssue =
    modules.length > 0 &&
    data.complete === modules.length &&
    data.average >= PASSING_AVERAGE;

  $(selectors.certificateCta).innerHTML = canIssue
    ? `<h2>Parabens! Voce esta aprovado.</h2>
       <p class="lead">Voce completou todos os modulos com media de <strong class="text-success">${data.average}%</strong>.</p>
       <a class="button button-secondary" href="certificado.html">Emitir Meu Certificado</a>`
    : `<h2>Continue sua jornada</h2>
       <p class="lead">Faltam ${modules.length - data.complete} modulo(s) para concluir a certificacao.</p>
       <a class="button button-primary" href="modulos.html">Continuar Estudando</a>`;
};

// Orquestra a renderização completa do dashboard
const renderDashboard = (user, modules) => {
  const data = stats(modules);
  renderSummary(modules, data);
  renderProgress(modules);
  renderStatus(modules);
  renderTasks(modules, user, data.average);
  renderCertificateCta(modules, data);
};

// Busca JSON de uma URL usando a função apiFetch já existente no projeto
const fetchJson = async (url) => {
  const response = await apiFetch(url);
  if (!response) return null;
  if (!response.ok) throw new Error("Nao foi possivel carregar os dados.");
  return response.json();
};

// Ponto de entrada: executa quando o HTML termina de carregar
document.addEventListener("DOMContentLoaded", async () => {
  // redireciona para login se o token não for válido
  if (!tokenValido()) {
    requireAuth();
    return;
  }

  try {
    // busca dados do usuário e lista de módulos em paralelo
    const user = await fetchJson("/api/usuarios/me");
    const modules = (await fetchJson("/api/exames")).map(normalizeModule);
    renderDashboard(user, modules);
  } catch (error) {
    // exibe mensagem de erro na seção de status caso algo falhe
    $(selectors.dashboardStatus).innerHTML = `
      <div class="alert alert-error is-visible">${error.message}</div>`;
  }
});
