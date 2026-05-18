function setActivateInput() {
    // Seleciona todos os inputs que estão dentro de .input-box
    const inputs = document.querySelectorAll('.input-box input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('deactivated');
            input.classList.add('activated');
        });

        // Quando o input perde o foco
        input.addEventListener('blur', () => {
            if (input.value === "") {
                input.classList.remove('activated');
                input.classList.add('deactivated');
            }
        });
    });
}

setActivateInput();