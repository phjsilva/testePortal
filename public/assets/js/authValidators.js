const inputEmail = document.getElementById("email");
const inputCPF = document.getElementById("cpf");
const inputPassword = document.getElementById("password");
const inputName = document.getElementById("name");
const cpfError = document.getElementById("cpf-error");
const passwordError = document.getElementById("password-error");
const emailError = document.getElementById("email-error");
const nameError = document.getElementById("name-error");
const form = document.getElementById("form");

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
}

function setNameError(show) {
    if (show) {
        inputName.classList.add("input-error");
        nameError.style.display = "block";
    } else {
        inputName.classList.remove("input-error");
        nameError.style.display = "none";
    }
}

function setEmailError(show) {
    if (show) {
        inputEmail.classList.add("input-error");
        emailError.style.display = "block";
    } else {
        inputEmail.classList.remove("input-error");
        emailError.style.display = "none";
    }
}

function setCPFError(show) {
    if (show) {
        inputCPF.classList.add("input-error");
        cpfError.style.display = "block";
    } else {
        inputCPF.classList.remove("input-error");
        cpfError.style.display = "none";
    }
}

function setPasswordError(show) {
    if (show) {
        inputPassword.classList.add("input-error");
        passwordError.style.display = "block";
    } else {
        inputPassword.classList.remove("input-error");
        passwordError.style.display = "none";
    }
}

inputName &&
    inputName.addEventListener("input", () => {
        setNameError(false);
    });

inputEmail &&
    inputEmail.addEventListener("input", () => {
        setEmailError(false);
    });

inputPassword.addEventListener("input", () => {
    setPasswordError(false);
});

inputCPF &&
    inputCPF.addEventListener("input", () => {
        inputCPF.value = mascaraCPF(inputCPF.value);
        setCPFError(false);
    });

function validarFormulario() {
    let valido = true;

    if (inputName && inputName.value.trim() === "") {
        setNameError(true);
        valido = false;
    }

    if (inputEmail && !validarEmail(inputEmail.value)) {
        setEmailError(true);
        valido = false;
    }

    if (inputCPF && !validarCPF(inputCPF.value)) {
        setCPFError(true);
        valido = false;
    }

    if (inputPassword && inputPassword.value.trim() === "") {
        setPasswordError(true);
        valido = false;
    }

    return valido;
}

window.validarFormulario = validarFormulario;