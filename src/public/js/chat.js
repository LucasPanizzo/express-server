const socketClient = io()
// CHAT

const form = document.getElementById('form')
const input = document.getElementById('message')
const chat = document.getElementById('chat')

let usuario = null

if (!usuario) {
  Swal.fire({
    title: 'BIENVENIDO',
    text: 'Ingresa tu usuario',
    input: 'text',
    inputValidator: (value) => {
      if (!value) {
        return 'Necesitas ingresar un usuario'
      }
    },
  }).then((username) => {
    usuario = username.value
  })
}
form.onsubmit = (e) => {
  e.preventDefault()

  const info = {
    user: usuario,
    message: input.value,
  }

  socketClient.emit('mensaje', info)
  input.value = ''
}

socketClient.on('chat',messages=>{
    const chatRender = messages.map(elem=>{
        return `<p><strong>${elem.user}: </strong>${elem.message}</p>`
    }).join(' ')
    chat.innerHTML = chatRender
})