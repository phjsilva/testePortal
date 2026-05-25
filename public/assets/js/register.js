form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const valido = window.validarFormulario();

    if (!valido) return;

    const data = {
        nome: inputName.value,
        email: inputEmail.value,
        cpf: inputCPF.value,
        senha: inputPassword.value,
    };

    try {
        const response = await fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert("Cadastro realizado!");
        window.location.href = "/login.html";
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor");
    }
});