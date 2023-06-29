import { currentSessionService } from "../services/users.services.js";
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";

export const currentSession = async (req, res) => { 
    try {
        const current = await currentSessionService(await req.session.userInfo)
        res.json(current)
    } catch {
        logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}