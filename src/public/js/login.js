const btnMailing = document.getElementById("btnMailing");

btnMailing.onclick = async ()  => {
    const { value: email } = await Swal.fire({
        title: 'Recuperación de contraseña',
        input: 'email',
        inputLabel: 'Ingresa tu correo electronico',
        inputPlaceholder: '...',
        confirmButtonText: 'Enviar',
        allowOutsideClick: false,
        showCancelButton: true,
      })
      
        let changePassword = {email};
        const config = {
            method: "POST",
            body: JSON.stringify(changePassword),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
        fetch('/api/users/passwordForget', config)
        .then((resp) => resp.json())
        Swal.fire({
            title: 'Te hemos envíado un mail para reestablecer tu contraseña.',
            icon: 'success'
        })
}