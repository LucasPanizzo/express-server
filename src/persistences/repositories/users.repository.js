import UsersDTO from "../DTOs/users.dto.js";
import CurrentDTO from "../DTOs/current.dto.js";
import CustomError from "../../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../../errors/errorMessages.js";
import logger from "../../winston.js";
export default class userRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createUser(user) {
        try {
            const userDTO = new UsersDTO(user)
            const userDAO = this.dao.createUser(userDTO)
            return userDAO
        } catch {
            logger.error(ErrorsMessage.USER_ADD_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_ADD_CAUSE,
                message: ErrorsMessage.USER_ADD_ERROR
            });
        }
    }
    async currentSession(info) {
        try {
            const current = new CurrentDTO(await info)
            return current
        } catch {
            logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.SESSION_ERROR,
                cause: ErrorsCause.SESSION_INVALID_CAUSE,
                message: ErrorsMessage.SESSION_INVALID_ERROR
            });
        }
    }
}