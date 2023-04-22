import MongoDB from '../DAOs/MongoDB/chat.manager.js'
import { messageModels } from '../MongoDB/models/chat.models.js'

let persistence = new MongoDB('message', messageModels)

export async function getMessages() {
    return await persistence.getMessages()
}

export async function newMessage(message) {
    return await persistence.newMessage(message)
}