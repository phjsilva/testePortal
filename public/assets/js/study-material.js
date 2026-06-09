// Controla a página material-estudo.html (detalhe de um módulo)
(function () {
    // Lê o parâmetro moduleId da query string da URL usando URLSearchParams
    function getModuleId() {
        return new URLSearchParams(window.location.search).get("moduleId");
    }

    // Busca o módulo correspondente ao parâmetro moduleId recebido na URL
    function findModule(moduleId) {
        return (window.studyModules || []).find(function (module) {
            return String(module.id) === String(moduleId);
        });
    }

    // Renderiza uma mensagem de erro na tela caso o módulo não seja localizado
    function renderNotFound() {
        var container = document.querySelector("[data-study-content]");
        if (!container) return;
        container.innerHTML = "";
        container.appendChild(
            StudyMaterialComponents.createElement(
                "div",
                "alert alert-error is-visible",
                "Material de estudo não encontrado."
            )
        );
    }

    // Renderiza o conteúdo detalhado do módulo selecionado
    function renderModule(selectedModule) {
        document.title = selectedModule.title + " | Material de Estudos";
        document.querySelector("[data-study-title]").textContent = selectedModule.title;
        document.querySelector("[data-study-subtitle]").textContent = selectedModule.subtitle;
        document.querySelector("[data-study-introduction]").textContent =
            selectedModule.introduction;

        // Atualiza dinamicamente o eyebrow para indicar o progresso visual do módulo em leitura
        var eyebrow = document.querySelector("[data-study-eyebrow]");
        if (eyebrow) {
            eyebrow.textContent = "Módulo " + selectedModule.id + " • Leitura";
        }

        var moduleContent = selectedModule.contents || [];
        var contentContainer = document.querySelector("[data-study-content]");
        contentContainer.innerHTML = "";
        
        // Renderiza dinamicamente cada seção teórica do material de estudos
        moduleContent.forEach(function (currentSection, index) {
            contentContainer.appendChild(StudyMaterialComponents.renderStudySection(currentSection, index));
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        var selectedModule = findModule(getModuleId());
        if (!selectedModule) {
            renderNotFound();
            return;
        }

        renderModule(selectedModule);
    });
})();
