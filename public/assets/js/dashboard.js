(function () {
    var selectors = {
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

    function $(selector) {
        return document.querySelector(selector);
    }

    function formatPercent(value) {
        return Math.round(value) + "%";
    }

    function clampPercent(value) {
        var numericValue = Number(value || 0);
        return Math.max(0, Math.min(100, numericValue));
    }

    function normalizeModule(module) {
        var bestGrade = Number(module.melhor_nota || 0);
        var lastGrade = Number(module.ultima_nota || 0);

        return {
            id: Number(module.nivel),
            nome: module.titulo || "Modulo " + module.nivel,
            status: module.status,
            nota: bestGrade || null,
            ultimaNota: lastGrade,
            percentualAcertos: clampPercent(bestGrade || lastGrade),
            tentativasUsadas: Math.max(
                Number(module.tentativas_iniciadas || 0),
                Number(module.tentativas_usadas || 0),
                Number(module.maior_tentativa || 0)
            ),
            tentativas: 2,
        };
    }

    function stats(modules) {
        var complete = modules.filter(function (module) { return module.status === "concluido"; }).length;
        var notes = modules.filter(function (module) { return module.nota !== null; }).map(function (module) { return module.nota; });
        var best = notes.length ? Math.max.apply(null, notes) : 0;
        var lastModule = modules.slice().reverse().find(function (module) { return module.ultimaNota > 0; });
        var last = lastModule ? lastModule.ultimaNota : 0;
        var average = notes.length ? Math.round(notes.reduce(function (sum, note) { return sum + note; }, 0) / notes.length) : 0;
        var progress = modules.length ? (complete / modules.length) * 100 : 0;
        return { complete: complete, best: best, last: last, average: average, progress: progress };
    }

    function moduleProgressPercent(module) {
        return clampPercent(module.percentualAcertos);
    }

    function updateProgressBars(containerSelector) {
        document.querySelectorAll(containerSelector + " [data-width]").forEach(function (bar) {
            bar.style.width = bar.dataset.width + "%";
        });
    }

    function moduleProgressTemplate(module) {
        var progress = moduleProgressPercent(module);
        var barClass = progress >= 100 ? "success" : "";

        return '<div class="module-progress-row"><div class="row-between"><strong>' + module.nome + '</strong><span>' + (module.nota !== null ? module.nota + "%" : "") + '</span></div><div class="progress"><div class="progress-bar ' + barClass + '" data-width="' + progress + '"></div></div></div>';
    }

    function renderProgress(modules) {
        $(selectors.dashboardProgress).innerHTML = modules.map(moduleProgressTemplate).join("");
        updateProgressBars(selectors.dashboardProgress);
    }

    function statusBadgeClass(status) {
        if (status === "concluido") return "badge-success";
        if (status === "disponivel") return "badge-primary";
        return "badge-muted";
    }

    function moduleStatusTemplate(module) {
        return '<div class="status-item"><span class="badge ' + statusBadgeClass(module.status) + '">' + module.status + '</span><div><strong>' + module.nome + '</strong><p class="muted">' + module.tentativasUsadas + '/' + module.tentativas + ' tentativas usadas</p></div></div>';
    }

    function renderStatus(modules) {
        $(selectors.dashboardStatus).innerHTML = modules.map(moduleStatusTemplate).join("");
    }

    function buildTasks(modules, user, average) {
        var tasks = modules.map(function (module) {
            return ["Complete o " + module.nome, module.status === "concluido"];
        });

        tasks.push(["Atinja media geral de 70% ou superior", average >= 70]);
        tasks.push(["Preencha seus dados no perfil", Boolean(user && user.nome)]);

        return tasks;
    }

    function taskTemplate(task) {
        return '<div class="task-item ' + (task[1] ? "is-done" : "") + '"><span>' + (task[1] ? "OK" : "--") + '</span><span>' + task[0] + '</span></div>';
    }

    function renderTasks(modules, user, average) {
        var tasks = buildTasks(modules, user, average);
        var done = tasks.filter(function (task) { return task[1]; }).length;
        var percent = tasks.length ? (done / tasks.length) * 100 : 0;

        $(selectors.taskSummary).textContent = done + " de " + tasks.length + " tarefas concluidas";
        $(selectors.taskPercent).textContent = formatPercent(percent);
        $(selectors.taskBar).style.width = percent + "%";
        $(selectors.taskList).innerHTML = tasks.map(taskTemplate).join("");
    }

    function renderSummary(modules, data) {
        $(selectors.modulesComplete).textContent = data.complete + "/" + modules.length;
        $(selectors.bestGrade).textContent = data.best + "%";
        $(selectors.lastGrade).textContent = data.last + "%";
        $(selectors.averageGrade).textContent = data.average + "%";
        $(selectors.generalProgress).style.width = data.progress + "%";
        $(selectors.generalPercent).textContent = formatPercent(data.progress);
    }

    function renderCertificateCta(modules, data) {
        var canIssue = modules.length > 0 && data.complete === modules.length && data.average >= 70;
        $(selectors.certificateCta).innerHTML = canIssue
            ? '<h2>Parabens! Voce esta aprovado.</h2><p class="lead">Voce completou todos os modulos com media de <strong class="text-success">' + data.average + '%</strong>.</p><a class="button button-secondary" href="certificado.html">Emitir Meu Certificado</a>'
            : '<h2>Continue sua jornada</h2><p class="lead">Faltam ' + (modules.length - data.complete) + ' modulo(s) para concluir a certificacao.</p><a class="button button-primary" href="modulos.html">Continuar Estudando</a>';
    }

    function renderDashboard(user, modules) {
        var data = stats(modules);

        renderSummary(modules, data);
        renderProgress(modules);
        renderStatus(modules);
        renderTasks(modules, user, data.average);
        renderCertificateCta(modules, data);
    }

    async function fetchJson(url) {
        var response = await apiFetch(url);
        if (!response) return null;
        if (!response.ok) throw new Error("Nao foi possivel carregar os dados.");
        return response.json();
    }

    document.addEventListener("DOMContentLoaded", async function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        try {
            var user = await fetchJson("/api/usuarios/me");
            var modules = (await fetchJson("/api/exames")).map(normalizeModule);
            renderDashboard(user, modules);
        } catch (error) {
            $(selectors.dashboardStatus).innerHTML = '<div class="alert alert-error is-visible">' + error.message + '</div>';
        }
    });
})();
