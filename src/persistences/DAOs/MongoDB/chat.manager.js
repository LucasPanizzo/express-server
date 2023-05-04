import { messageModels } from "../../MongoDB/models/chat.models.js";
import CustomError from "../../../errors/newError.js";
import { ErrorsCause,ErrorsMessage,ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";

export default class messageManager{
    async getMessages(){
        try {
            const messages = await messageModels.find({})
            return messages
        } catch {
            logger.error(ErrorsMessage.CHAT_GET_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.CHAT_ERROR,
                cause: ErrorsCause.CHAT_GET_CAUSE,
                message: ErrorsMessage.CHAT_GET_ERROR
            });
        }
    }
    async newMessage(obj){
        try {
           const newMessage = await messageModels.create(obj)
           return newMessage
        } catch {
            logger.error(ErrorsMessage.CHAT_CREATE_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.CHAT_ERROR,
                cause: ErrorsCause.CHAT_CREATE_CAUSE,
                message: ErrorsMessage.CHAT_CREATE_ERROR
            });
        }
    }
}