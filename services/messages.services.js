import { newMessage,getMessages } from "../DAO/Persistences/messagesPersistence.js";


export async function getMessagesService(){
    const messages = await getMessages()
    return messages
}

export async function newMessageService(obj){
    const message = await newMessage(obj)
    return message
}