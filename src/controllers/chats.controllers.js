import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { currentSessionService } from "../services/users.services.js";

export const chatControllers = async(req,res)=>{
    try {
        const userInfo = await currentSessionService(req.session.userInfo)
        let condition
        if (userInfo.rol === "user") {
            condition = true
        } else {
            condition = false
        }
        res.render('chat',{"user":userInfo,"condition":condition})
    } catch{
        logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}