const form = document.getElementById('formulario');
const inputPassword = document.getElementById('password');
const token = form.getAttribute('data-token');
const id = form.getAttribute('data-id');

form.onsubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/users/changePassword/${id}/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password: inputPassword.value }),
        headers: { 'Content-Type': 'application/json' }
    });
    const responseJson = await response.json();
    if (responseJson.message.includes('token ha expirado')) {
        Swal.fire({
            title: 'Token ha expirado',
            text: responseJson.message,
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = '/';
        });
    } else if (responseJson.message.includes('exito')) {
        Swal.fire({
            title: 'Contraseña actualizada',
            text: responseJson.message,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = '/';
        });
    } else if (responseJson.message.includes('igual a la anterior')) {
        Swal.fire({
            title: 'Error',
            text: responseJson.message,
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload();
        });
    }
};