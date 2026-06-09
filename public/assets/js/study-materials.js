// Controla a página material-estudos.html (lista de módulos)
// Busca a lista de módulos e aciona a renderização
(function () {
    // Renderiza a lista de módulos de estudo a partir dos dados mockados
    function renderStudyModules() {
        var list = document.querySelector("[data-study-modules-list]");
        var count = document.querySelector("[data-study-module-count]");
        var studyModules = window.studyModules || [];

        if (count) {
            count.textContent = studyModules.length + " módulos disponíveis";
        }

        if (!list) return;
        list.innerHTML = "";

        // Itera sobre cada módulo disponível e adiciona seu card de renderização à lista
        studyModules.forEach(function (selectedModule) {
            list.appendChild(StudyMaterialComponents.renderStudyModuleCard(selectedModule));
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        renderStudyModules();
    });
})();
