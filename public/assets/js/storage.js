(function () {
    window.PortalSession = {
        logout: async function () {
           
            localStorage.removeItem("token");

            window.location.href = '/'
        },
    };
})();