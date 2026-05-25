(function () {
    var selectedModule = null;
    var descriptions = {
        1: "Introdução aos conceitos básicos",
        2: "Scrum Master, Product Owner e Time",
        3: "Sprints, Daily, Review e Retrospectiva",
        4: "Product Backlog e Sprint Backlog",
        5: "Prova completa de certificacao",
    };

    function attemptsUsed(module) {
        return Math.max(
            Number(module.tentativas_iniciadas || 0),
            Number(module.tentativas_usadas || 0),
            Number(module.maior_tentativa || 0)
        );
    }

    function displayGrade(module) {
        if (module.status === "concluido") {
            return Number(module.melhor_nota || 0);
        }
        if (Number(module.ultima_nota || 0) > 0) {
            return Number(module.ultima_nota);
        }
        return null;
    }

    function remaining(module) {
        return Math.max(0, 2 - attemptsUsed(module));
    }

    function isExhausted(module) {
        return (
            module.status !== "concluido" &&
            !module.em_andamento &&
            attemptsUsed(module) >= 2
        );
    }

    function statusLabel(status) {
        return {
            bloqueado: "Bloqueado",
            disponivel: "Disponivel",
            concluido: "Concluido",
        }[status] || status;
    }

    function normalizeModule(module) {
        return {
            id: Number(module.nivel),
            nome: module.titulo || "Modulo " + module.nivel,
            descricao: descriptions[Number(module.nivel)] || "Modulo de certificacao",
            status: module.status,
            melhor_nota: Number(module.melhor_nota || 0),
            ultima_nota: Number(module.ultima_nota || 0),
            tentativas_iniciadas: Number(module.tentativas_iniciadas || 0),
            tentativas_usadas: Number(module.tentativas_usadas || 0),
            maior_tentativa: Number(module.maior_tentativa || 0),
            em_andamento: Boolean(module.em_andamento),
        };
    }

    function withDisplayFields(module) {
        return Object.assign({}, module, {
            nota: displayGrade(module),
        });
    }

    async function fetchModules() {
        var response = await apiFetch("/api/exames");
        if (!response) return [];
        if (!response.ok) throw new Error("Não foi possível carregar os módulos.");
        var data = await response.json();
        return data.map(normalizeModule).map(withDisplayFields);
    }

    async function iniciarOuContinuarModulo(module, novaTentativa) {
        if (novaTentativa) {
            var retry = await apiFetch("/api/questoes/proxima-tentativa", {
                method: "PATCH",
                body: JSON.stringify({ id_modulo: module.id }),
            });
            if (!retry) return null;
            var retryData = await retry.json().catch(function () {
                return {};
            });
            if (!retry.ok) {
                alert(retryData.message || "Não foi possível iniciar a nova tentativa.");
                return null;
            }
            return retryData;
        }

        var response = await apiFetch("/api/questoes/iniciar-modulo", {
            method: "POST",
            body: JSON.stringify({ id_modulo: module.id }),
        });
        if (!response) return null;

        var data = await response.json().catch(function () {
            return {};
        });

        if (response.status === 201 || response.status === 200) {
            return data;
        }

        alert(data.message || "Não foi possível iniciar a prova.");
        return null;
    }

    function renderModules(modules) {
        var list = document.querySelector("[data-modules-list]");
        var complete = modules.filter(function (module) {
            return module.status === "concluido";
        }).length;
        var progress = modules.length ? (complete / modules.length) * 100 : 0;

        document.querySelector("[data-module-count]").textContent =
            complete + "/" + modules.length + " Módulos";
        document.querySelector("[data-module-progress]").style.width = progress + "%";

        list.innerHTML = modules
            .map(function (module) {
                var used = attemptsUsed(module);
                var left = remaining(module);
                var exhausted = isExhausted(module);
                var stateClass =
                    module.status === "bloqueado"
                        ? "is-locked"
                        : module.status === "concluido"
                        ? "is-complete"
                        : "is-available";
                var badgeClass =
                    module.status === "concluido"
                        ? "badge-success"
                        : module.status === "disponivel"
                        ? "badge-primary"
                        : "badge-muted";
                var grade = displayGrade(module);
                var gradeLabel =
                    grade === null
                        ? ""
                        : module.status === "concluido"
                        ? "Melhor: " + grade + "%"
                        : "Ultima: " + grade + "%";

                return (
                    '<article class="card module-card ' +
                    stateClass +
                    (exhausted ? " is-exhausted" : "") +
                    '" data-module-id="' +
                    module.id +
                    '">' +
                    '<div class="module-main"><div class="module-icon" aria-hidden="true">' +
                    module.id +
                    '</div><div><h2>' +
                    module.nome +
                    '</h2><p class="muted">' +
                    module.descricao +
                    '</p>' +
                    '<div class="module-meta"><span class="badge ' +
                    badgeClass +
                    '">' +
                    statusLabel(module.status) +
                    "</span>" +
                    (module.status !== "bloqueado"
                        ? '<span class="badge badge-muted">' +
                          used +
                          "/2 tentativas</span>" +
                          (left > 0
                              ? '<span class="badge badge-muted">' +
                                left +
                                " restante" +
                                (left === 1 ? "" : "s") +
                                "</span>"
                              : "") +
                          (module.em_andamento
                              ? '<span class="badge badge-primary">Em andamento</span>'
                              : "")
                        : "") +
                    (gradeLabel
                        ? '<span class="badge ' +
                          (grade >= 70 ? "badge-success" : "badge-danger") +
                          '">' +
                          gradeLabel +
                          "</span>"
                        : "") +
                    "</div></div></div>" +
                    (exhausted
                        ? '<div class="alert alert-error is-visible">Tentativas esgotadas. Voce não atingiu a nota minima de 70%.</div>'
                        : "") +
                    "</article>"
                );
            })
            .join("");

        list.querySelectorAll("[data-module-id]").forEach(function (card) {
            card.addEventListener("click", function () {
                var module = modules.find(function (item) {
                    return item.id === Number(card.dataset.moduleId);
                });
                if (!module || module.status === "bloqueado") return;
                if (isExhausted(module)) return;
                openModal(module, module.status === "concluido");
            });
        });
    }

    function openModal(module, isRedo) {
        selectedModule = module;
        document.querySelector("[data-modal-title]").textContent = isRedo
            ? "Abrir Prova?"
            : "Iniciar Prova";
        document.querySelector("[data-modal-body]").innerHTML = isRedo
            ? "Você já foi aprovado neste módulo com nota <strong>" +
              module.melhor_nota +
              "%</strong>. Deseja revisar o ultimo exame?"
            : module.em_andamento
            ? "Você tem um exame em andamento neste módulo. Deseja continuar de onde parou?"
            : "Voce usou <strong>" +
              attemptsUsed(module) +
              " de 2</strong> tentativas. Restam <strong>" +
              remaining(module) +
              "</strong>. A nota minima para aprovacao e 70%.";
        var novaTentativa =
            !isRedo && !module.em_andamento && remaining(module) > 0 && attemptsUsed(module) > 0;
        document.querySelector("[data-modal-confirm]").textContent = isRedo
            ? "Abrir"
            : module.em_andamento
            ? "Continuar"
            : novaTentativa
            ? "Iniciar nova tentativa"
            : "Iniciar Prova";
        document.querySelector("[data-module-modal]").classList.add("is-visible");
        selectedModule._novaTentativa = novaTentativa;
    }

    function closeModal() {
        document.querySelector("[data-module-modal]").classList.remove("is-visible");
    }

    function renderError(message) {
        document.querySelector("[data-modules-list]").innerHTML =
            '<div class="alert alert-error is-visible">' + message + "</div>";
    }

    document.addEventListener("DOMContentLoaded", async function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        try {
            renderModules(await fetchModules());
        } catch (error) {
            renderError(error.message);
        }

        document.querySelector("[data-modal-cancel]").addEventListener("click", closeModal);
        document.querySelector("[data-module-modal]").addEventListener("click", function (event) {
            if (event.target.matches("[data-module-modal]")) closeModal();
        });
        document.querySelector("[data-modal-confirm]").addEventListener("click", async function () {
            if (!selectedModule) return;
            var button = this;
            button.disabled = true;
            try {
                if (selectedModule.status === "concluido") {
                    window.location.href =
                        "resultado.html?modulo=" +
                        encodeURIComponent(selectedModule.id);
                    return;
                }

                var exame = await iniciarOuContinuarModulo(
                    selectedModule,
                    selectedModule._novaTentativa
                );
                if (exame && exame.id_exame) {
                    window.location.href =
                        "exame.html?id_exame=" +
                        encodeURIComponent(exame.id_exame) +
                        "&modulo=" +
                        encodeURIComponent(selectedModule.id);
                }
            } finally {
                button.disabled = false;
            }
        });
    });
})();