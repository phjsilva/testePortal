(function () {
    function showAlert(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className =
            "alert is-visible " +
            (type === "success" ? "alert-success" : "alert-error");
    }
    function clearAlert(element) {
        if (!element) return;
        element.textContent = "";
        element.className = "alert";
    }
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-back]").forEach(function (button) {
            button.addEventListener("click", function () {
                window.location.href = button.dataset.back || "hub.html";
            });
        });
    });
    window.ScrumUI = {
        showAlert: showAlert,
        clearAlert: clearAlert,
        formatPercent: function (value) {
            return Math.round(value) + "%";
        },
    };
})();