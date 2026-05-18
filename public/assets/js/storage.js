(function () {
    window.PortalSession = {
        logout: function () {
            localStorage.removeItem("token");
        },
    };
})();