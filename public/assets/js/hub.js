(function () {
    function renderProfile(user) {
        var name = document.querySelector("[data-user-name]");
        var email = document.querySelector("[data-user-email]");
        var avatar = document.querySelector("[data-user-avatar]");
        var displayName = user.nome || "Usuario";
        if (name) name.textContent = displayName;
        if (email) email.textContent = user.email || "";
        if (avatar) avatar.textContent = displayName.charAt(0).toUpperCase();
    }

    function renderMetrics(modules) {
        var complete = modules.filter(function (module) { return module.status === "concluido"; }).length;
        var notes = modules.filter(function (module) { return Number(module.melhor_nota || 0) > 0; }).map(function (module) { return Number(module.melhor_nota); });
        var best = notes.length ? Math.max.apply(null, notes) : 0;
        var progress = modules.length ? (complete / modules.length) * 100 : 0;
        document.querySelector("[data-hub-progress]").textContent = ScrumUI.formatPercent(progress);
        document.querySelector("[data-hub-progress-bar]").style.width = progress + "%";
        document.querySelector("[data-hub-modules]").textContent = complete + "/" + modules.length;
        document.querySelector("[data-hub-best]").textContent = best + "%";
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
            var modules = await fetchJson("/api/exames");
            renderProfile(user);
            renderMetrics(modules);
        } catch (error) {
            console.error(error);
        }

        var button = document.querySelector("[data-profile-button]");
        var menu = document.querySelector("[data-profile-menu]");
        button.addEventListener("click", function () {
            menu.classList.toggle("hidden");
        });
        document.addEventListener("click", function (event) {
            if (!button.contains(event.target) && !menu.contains(event.target)) menu.classList.add("hidden");
        });
        document.querySelector("[data-start-exam]").addEventListener("click", function () {
            window.location.href = "modulos.html";
        });
        document.querySelector("[data-open-profile]").addEventListener("click", function () {
            window.location.href = "perfil.html";
        });
        document.querySelector("[data-logout]").addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
        document.querySelector("[data-help]").addEventListener("click", function () {
            alert("Use Fazer Prova para iniciar os modulos. Acompanhe seu progresso no dashboard e edite seus dados no perfil.");
        });
    });
})();