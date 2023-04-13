import MongoDB from '../MongoDB/db/managers/chat.manager.js'
import { messageModels } from '../MongoDB/db/models/chat.models.js'

let persistence = new MongoDB('Messages', messageModels)

export async function getMessages() {
    return await persistence.getMessages()
}

export async function newMessage(message) {
    return await persistence.newMessage(message)
}