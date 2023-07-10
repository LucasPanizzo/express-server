const btnMailing = document.getElementById("btnMailing");
const spanEmail = document.getElementById("email");
const email = spanEmail.textContent;

btnMailing.onclick = async ()  => {
    console.log(email);
        const config = {
            method: "POST",
            body: JSON.stringify({email:email}),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
        console.log(config.body);
        fetch('/api/users/passwordForget', config)
        .then((resp) => resp.json())
        Swal.fire({
            title: 'Te hemos envíado un mail para reestablecer tu contraseña.',
            icon: 'success'
        })
}