
 document.addEventListener("DOMContentLoaded", async function () {
  requireGuest()
  form &&
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const valido = window.validarFormulario()

    if (!valido) return
    const data = {
      cpf: inputCPF.value,
      senha: inputPassword.value
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message)
        return
      }

      localStorage.setItem('token', result.token)

      window.location.href = '/hub.html'
    } catch (error) {
      console.error(error)
      alert('Erro ao conectar com o servidor')
    }
  })})