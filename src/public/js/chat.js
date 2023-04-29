const socketClient = io() 
// CHAT

const form = document.getElementById('form')
const input = document.getElementById('message')
const chat = document.getElementById('chat')
const user = document.getElementById('user-name')

let usuario = user.textContent

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