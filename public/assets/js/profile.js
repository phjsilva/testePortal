(function () {
    function fillAvatar(avatar, name) {
        avatar.textContent = (name || "U").charAt(0).toUpperCase();
    }

    async function fetchProfile() {
        var response = await apiFetch("/api/usuarios/me");
        if (!response) return null;
        if (!response.ok) throw new Error("Nao foi possivel carregar o perfil.");
        return response.json();
    }

    async function updateField(url, body) {
        var response = await apiFetch(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
        if (!response) return null;
        var data = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(data.message || "Nao foi possivel salvar as alteracoes.");
        return data;
    }

    document.addEventListener("DOMContentLoaded", async function () {
        if (!tokenValido()) {
            requireAuth();
            return;
        }

        var form = document.querySelector("[data-profile-form]");
        var alertBox = document.querySelector("[data-profile-alert]");
        var avatar = document.querySelector("[data-avatar-preview]");
        var currentUser = null;

        try {
            currentUser = await fetchProfile();
            form.name.value = currentUser.nome || "";
            form.email.value = currentUser.email || "";
            fillAvatar(avatar, currentUser.nome);
        } catch (error) {
            ScrumUI.showAlert(alertBox, error.message, "error");
            return;
        }

        form.profilePhoto.addEventListener("change", function () {
            ScrumUI.showAlert(alertBox, "Foto de perfil ainda nao e salva no banco de dados.", "error");
        });

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            ScrumUI.clearAlert(alertBox);

            var name = form.name.value.trim();
            var email = form.email.value.trim();
            var newPassword = form.newPassword.value;
            var confirmPassword = form.confirmPassword.value;

            if (!name || !email) {
                return ScrumUI.showAlert(alertBox, "Nome e email sao obrigatorios.", "error");
            }

            if (newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    return ScrumUI.showAlert(alertBox, "As novas senhas nao coincidem.", "error");
                }
                if (newPassword.length < 6) {
                    return ScrumUI.showAlert(alertBox, "A nova senha deve ter pelo menos 6 caracteres.", "error");
                }
            }

            try {
                if (name !== currentUser.nome) {
                    currentUser = await updateField("/api/usuarios/nome", { nome: name });
                }
                if (email !== currentUser.email) {
                    currentUser = await updateField("/api/usuarios/email", { email: email });
                }
                if (newPassword) {
                    await updateField("/api/usuarios/senha", { senha: newPassword });
                }

                form.currentPassword.value = "";
                form.newPassword.value = "";
                form.confirmPassword.value = "";
                fillAvatar(avatar, currentUser.nome);
                ScrumUI.showAlert(alertBox, "Perfil atualizado com sucesso.", "success");
            } catch (error) {
                ScrumUI.showAlert(alertBox, error.message, "error");
            }
        });
    });
})();