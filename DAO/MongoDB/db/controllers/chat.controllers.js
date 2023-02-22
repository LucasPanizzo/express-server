import { messageModels } from "../models/chat.models.js";

export default class messageManager{
    async getMessages(){
        try {
            const messages = await messageModels.find({})
            return messages
        } catch (error) {
            console.log(error);
        }
    }
    async newMessage(obj){
        try {

           const newMessage = await messageModels.create(obj)
           return newMessage
        } catch (error) {
            console.log(error);
        }
    }
}