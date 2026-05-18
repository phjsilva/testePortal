(function () {
    function normalizeModule(module) {
        return {
            id: Number(module.nivel),
            nome: module.titulo || "Modulo " + module.nivel,
            status: module.status,
            nota: Number(module.melhor_nota || 0) || null,
            ultimaNota: Number(module.ultima_nota || 0),
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

    function renderProgress(modules) {
        document.querySelector("[data-dashboard-progress]").innerHTML = modules.map(function (module) {
            var progress = module.status === "concluido" ? 100 : module.status === "disponivel" ? 50 : 0;
            return '<div class="module-progress-row"><div class="row-between"><strong>' + module.nome + '</strong><span>' + (module.nota !== null ? module.nota + "%" : "") + '</span></div><div class="progress"><div class="progress-bar ' + (module.status === "concluido" ? "success" : "") + '" data-width="' + progress + '"></div></div></div>';
        }).join("");
        document.querySelectorAll("[data-dashboard-progress] [data-width]").forEach(function (bar) {
            bar.style.width = bar.dataset.width + "%";
        });
    }

    function renderStatus(modules) {
        document.querySelector("[data-dashboard-status]").innerHTML = modules.map(function (module) {
            var badge = module.status === "concluido" ? "badge-success" : module.status === "disponivel" ? "badge-primary" : "badge-muted";
            return '<div class="status-item"><span class="badge ' + badge + '">' + module.status + '</span><div><strong>' + module.nome + '</strong><p class="muted">' + module.tentativasUsadas + '/' + module.tentativas + ' tentativas usadas</p></div></div>';
        }).join("");
    }

    function renderTasks(modules, user, average) {
        var tasks = modules.map(function (module) {
            return ["Complete o " + module.nome, module.status === "concluido"];
        });
        tasks.push(["Atinja media geral de 70% ou superior", average >= 70]);
        tasks.push(["Preencha seus dados no perfil", Boolean(user && user.nome)]);

        var done = tasks.filter(function (task) { return task[1]; }).length;
        var percent = tasks.length ? (done / tasks.length) * 100 : 0;
        document.querySelector("[data-task-summary]").textContent = done + " de " + tasks.length + " tarefas concluidas";
        document.querySelector("[data-task-percent]").textContent = Math.round(percent) + "%";
        document.querySelector("[data-task-bar]").style.width = percent + "%";
        document.querySelector("[data-task-list]").innerHTML = tasks.map(function (task) {
            return '<div class="task-item ' + (task[1] ? "is-done" : "") + '"><span>' + (task[1] ? "OK" : "--") + '</span><span>' + task[0] + '</span></div>';
        }).join("");
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
            var data = stats(modules);
            document.querySelector("[data-modules-complete]").textContent = data.complete + "/" + modules.length;
            document.querySelector("[data-best-grade]").textContent = data.best + "%";
            document.querySelector("[data-last-grade]").textContent = data.last + "%";
            document.querySelector("[data-average-grade]").textContent = data.average + "%";
            document.querySelector("[data-general-progress]").style.width = data.progress + "%";
            document.querySelector("[data-general-percent]").textContent = Math.round(data.progress) + "%";
            renderProgress(modules);
            renderStatus(modules);
            renderTasks(modules, user, data.average);

            var canIssue = modules.length > 0 && data.complete === modules.length && data.average >= 70;
            document.querySelector("[data-certificate-cta]").innerHTML = canIssue
                ? '<h2>Parabens! Voce esta aprovado.</h2><p class="lead">Voce completou todos os modulos com media de <strong class="text-success">' + data.average + '%</strong>.</p><a class="button button-secondary" href="certificado.html">Emitir Meu Certificado</a>'
                : '<h2>Continue sua jornada</h2><p class="lead">Faltam ' + (modules.length - data.complete) + ' modulo(s) para concluir a certificacao.</p><a class="button button-primary" href="modulos.html">Continuar Estudando</a>';
        } catch (error) {
            document.querySelector("[data-dashboard-status]").innerHTML = '<div class="alert alert-error is-visible">' + error.message + '</div>';
        }
    });
})();