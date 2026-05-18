(function () {
    var certificateData = null;

    function formatDate(value) {
        var date = value ? new Date(value) : new Date();
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    }

    function generateCertificateId() {
        return "SCRUM-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 89999);
    }

    async function fetchJson(url) {
        var response = await apiFetch(url);
        if (!response) return null;
        var data = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(data.message || "Nao foi possivel carregar dados.");
        return data;
    }

    async function calculateAverageWithBreakdown() {
        try {
            var exames = await fetchJson("/api/questoes/exames");
            if (!exames || !exames.length) return { average: 0, easy: 0, medium: 0, hard: 0 };

            var stats = { easy: [], medium: [], hard: [], all: [] };

            exames.forEach(function (exame) {
                if (exame.ultima_nota > 0 && exame.aprovado) {
                    stats.all.push(exame.ultima_nota);
                    var nivel = Number(exame.nivel) || 1;
                    if (nivel <= 3) {
                        stats.easy.push(exame.ultima_nota);
                    } else if (nivel <= 6) {
                        stats.medium.push(exame.ultima_nota);
                    } else {
                        stats.hard.push(exame.ultima_nota);
                    }
                }
            });

            function calculateAvg(arr) {
                return arr.length ? Math.round(arr.reduce(function (sum, s) { return sum + s; }, 0) / arr.length) : 0;
            }

            return {
                average: calculateAvg(stats.all) || 85,
                easy: calculateAvg(stats.easy),
                medium: calculateAvg(stats.medium),
                hard: calculateAvg(stats.hard)
            };
        } catch (error) {
            console.error("Erro ao calcular media:", error);
            return { average: 85, easy: 0, medium: 0, hard: 0 };
        }
    }

    // Exibe o modal e retorna Promise que resolve true (confirmar) ou false (cancelar)
    function askForCertificate() {
        return new Promise(function (resolve) {
            var backdrop = document.getElementById("modal-certificate-confirm");
            var btnConfirm = document.getElementById("modal-cert-confirm");
            var btnCancel = document.getElementById("modal-cert-cancel");

            if (!backdrop) {
                resolve(confirm("Deseja gerar seu certificado de conclusao?"));
                return;
            }

            backdrop.classList.add("is-visible");

            function onConfirm() { cleanup(); resolve(true); }
            function onCancel() { cleanup(); resolve(false); }
            function onBackdropClick(e) { if (e.target === backdrop) onCancel(); }
            function onKeydown(e) { if (e.key === "Escape") onCancel(); }

            function cleanup() {
                backdrop.classList.remove("is-visible");
                btnConfirm.removeEventListener("click", onConfirm);
                btnCancel.removeEventListener("click", onCancel);
                backdrop.removeEventListener("click", onBackdropClick);
                document.removeEventListener("keydown", onKeydown);
            }

            btnConfirm.addEventListener("click", onConfirm);
            btnCancel.addEventListener("click", onCancel);
            backdrop.addEventListener("click", onBackdropClick);
            document.addEventListener("keydown", onKeydown);
        });
    }

    async function populateCertificate(user, scores) {
        try {
            var certificateId = generateCertificateId();
            var emissionDate = new Date();

            certificateData = {
                name: user.nome || "Aluno Portal Scrum",
                cpf: user.cpf || "---",
                email: user.email || "---",
                date: formatDate(emissionDate),
                average: scores.average,
                easy: scores.easy,
                medium: scores.medium,
                hard: scores.hard,
                id: certificateId
            };

            document.querySelector("[data-certificate-name]").textContent = certificateData.name;
            document.querySelector("[data-certificate-date]").textContent = certificateData.date;
            document.querySelector("[data-certificate-grade]").textContent = certificateData.average + "%";
            document.querySelector("[data-certificate-id]").textContent = certificateData.id;

            var cpfEl = document.querySelector("[data-certificate-cpf]");
            var emailEl = document.querySelector("[data-certificate-email]");
            var breakdownEl = document.querySelector("[data-certificate-breakdown]");

            if (cpfEl) cpfEl.textContent = certificateData.cpf;
            if (emailEl) emailEl.textContent = certificateData.email;
            if (breakdownEl) {
                breakdownEl.innerHTML =
                    "Facil: " + certificateData.easy + "% | " +
                    "Medio: " + certificateData.medium + "% | " +
                    "Dificil: " + certificateData.hard + "%";
            }
        } catch (error) {
            console.error("Erro ao popular certificado:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", async function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        try {
            var confirmed = await askForCertificate();

            if (!confirmed) {
                window.location.href = "dashboard.html";
                return;
            }

            var user = await fetchJson("/api/usuarios/me");
            if (!user) throw new Error("Usuario nao encontrado.");

            var scores = await calculateAverageWithBreakdown();
            await populateCertificate(user, scores);

            document.querySelectorAll("[data-print-certificate]").forEach(function (btn) {
                btn.addEventListener("click", function () { window.print(); });
            });

            document.querySelectorAll("[data-share-certificate]").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var text = "Conclui minha certificacao Scrum com nota final de " +
                        certificateData.average + "% no Portal Scrum. Certificado: " +
                        certificateData.id;

                    if (navigator.share) {
                        navigator.share({ title: "Certificado Portal Scrum", text: text });
                    } else {
                        navigator.clipboard.writeText(text).then(function () {
                            alert("Texto copiado para compartilhamento!");
                        });
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao carregar certificado:", error);
            alert("Erro: " + error.message);
            window.location.href = "dashboard.html";
        }
    });
})();