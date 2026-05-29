(function () {
    function fillAvatar(avatar, name) {
        if (!avatar) return;

        avatar.textContent = (name || "U")
            .charAt(0)
            .toUpperCase();
    }

    async function fetchProfile() {
        var response = await apiFetch("/api/usuarios/me");

        if (!response) return null;

        if (!response.ok) {
            throw new Error("Não foi possível carregar o perfil.");
        }

        var data = await response.json().catch(function () {
            return null;
        });

        return data;
    }

    async function updateField(url, body) {
        var response = await apiFetch(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        });

        if (!response) return null;

        var data = await response.json().catch(function () {
            return {};
        });

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Não foi possível salvar as alterações.",
            );
        }

        return data;
    }

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    }

    document.addEventListener(
        "DOMContentLoaded",
        async function () {
            if (!tokenValido()) {
                requireAuth();
                return;
            }

            var form = document.querySelector(
                "[data-profile-form]",
            );

            if (!form) return;

            var alertBox = document.querySelector(
                "[data-profile-alert]",
            );

            var avatar = document.querySelector(
                "[data-avatar-preview]",
            );

            var currentUser = null;

            try {
                currentUser = await fetchProfile();

                if (!currentUser) {
                    throw new Error(
                        "Não foi possível carregar os dados do usuário.",
                    );
                }

                if (form.name) {
                    form.name.value =
                        currentUser.nome || "";
                }

                if (form.email) {
                    form.email.value =
                        currentUser.email || "";
                }

                fillAvatar(avatar, currentUser.nome);
            } catch (error) {
                ScrumUI.showAlert(
                    alertBox,
                    error.message,
                    "error",
                );

                return;
            }

            if (form.profilePhoto) {
                form.profilePhoto.addEventListener(
                    "change",
                    function () {
                        ScrumUI.showAlert(
                            alertBox,
                            "Foto de perfil ainda não é salva no banco de dados.",
                            "error",
                        );

                        form.profilePhoto.value = "";
                    },
                );
            }

            form.addEventListener(
                "submit",
                async function (event) {
                    event.preventDefault();

                    ScrumUI.clearAlert(alertBox);

                    var name = form.name
                        ? form.name.value.trim()
                        : "";

                    var email = form.email
                        ? form.email.value.trim()
                        : "";

                    var currentPassword =
                        form.currentPassword
                            ? form.currentPassword.value
                            : "";

                    var newPassword =
                        form.newPassword
                            ? form.newPassword.value
                            : "";

                    var confirmPassword =
                        form.confirmPassword
                            ? form.confirmPassword.value
                            : "";

                    if (!name || !email) {
                        return ScrumUI.showAlert(
                            alertBox,
                            "Nome e email são obrigatórios.",
                            "error",
                        );
                    }

                    if (!isValidEmail(email)) {
                        return ScrumUI.showAlert(
                            alertBox,
                            "Digite um email válido.",
                            "error",
                        );
                    }

                    if (
                        newPassword ||
                        confirmPassword
                    ) {
                        if (
                            newPassword !==
                            confirmPassword
                        ) {
                            return ScrumUI.showAlert(
                                alertBox,
                                "As novas senhas não coincidem.",
                                "error",
                            );
                        }

                        if (
                            newPassword.length < 6
                        ) {
                            return ScrumUI.showAlert(
                                alertBox,
                                "A nova senha deve ter pelo menos 6 caracteres.",
                                "error",
                            );
                        }

                        if (!currentPassword) {
                            return ScrumUI.showAlert(
                                alertBox,
                                "Digite sua senha atual.",
                                "error",
                            );
                        }
                    }

                    try {
                        if (
                            name !==
                            currentUser.nome
                        ) {
                            await updateField(
                                "/api/usuarios/nome",
                                {
                                    nome: name,
                                },
                            );

                            currentUser.nome =
                                name;
                        }

                        if (
                            email !==
                            currentUser.email
                        ) {
                            await updateField(
                                "/api/usuarios/email",
                                {
                                    email: email,
                                },
                            );

                            currentUser.email =
                                email;
                        }

                        if (newPassword) {
                            await updateField(
                                "/api/usuarios/senha",
                                {
                                    senhaAtual:
                                        currentPassword,
                                    novaSenha:
                                        newPassword,
                                },
                            );
                        }

                        if (
                            form.currentPassword
                        ) {
                            form.currentPassword.value =
                                "";
                        }

                        if (form.newPassword) {
                            form.newPassword.value =
                                "";
                        }

                        if (
                            form.confirmPassword
                        ) {
                            form.confirmPassword.value =
                                "";
                        }

                        fillAvatar(
                            avatar,
                            currentUser.nome,
                        );

                        ScrumUI.showAlert(
                            alertBox,
                            "Perfil atualizado com sucesso.",
                            "success",
                        );
                    } catch (error) {
                        ScrumUI.showAlert(
                            alertBox,
                            error.message,
                            "error",
                        );
                    }
                },
            );
        },
    );
})();