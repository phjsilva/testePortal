(function () {
    var THEME_KEY = "scrum-theme";
    var LOGO_BY_THEME = {
        dark: "../assets/images/logoBranca.png",
        light: "../assets/images/logoEscuro.png",
    };

    function getTheme() {
        return localStorage.getItem(THEME_KEY) || "dark";
    }

    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.dataset.theme = theme;
    }

    function applyBrandLogos(theme) {
        var logoSrc = LOGO_BY_THEME[theme] || LOGO_BY_THEME.dark;
        document.querySelectorAll(".brand-logo").forEach(function (img) {
            img.src = logoSrc;
        });
    }

    function applyTheme() {
        var theme = getTheme();
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll("[data-theme-icon]").forEach(function (element) {
            element.textContent = theme === "dark" ? "L" : "D";
        });
        applyBrandLogos(theme);
    }

    function toggleTheme() {
        var current = document.documentElement.dataset.theme || "dark";
        setTheme(current === "dark" ? "light" : "dark");
        applyTheme();
    }

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme();
        document.querySelectorAll("[data-action='toggle-theme']").forEach(function (button) {
            button.addEventListener("click", toggleTheme);
        });
    });
})();