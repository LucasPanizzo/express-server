import { usersModels } from "../../MongoDB/models/users.models.js";
import { comparePasswords } from "../../../utilities.js";
import config from "../../../config.js";
import CustomError from "../../../errors/newError.js";
import { ErrorsCause,ErrorsMessage,ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";
export default class userManager {
    async createUser(user) {
        try {
            const newUser = await usersModels.create(user)
            return newUser
        } catch {
            logger.error(ErrorsMessage.USER_ADD_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_ADD_CAUSE,
                message: ErrorsMessage.USER_ADD_ERROR
            });
        }
    }
    async getUser(email,password) {
        try {
            if (email === config.ADMINMAIL && password === config.ADMINPASSWORD) {
                const userAdmin = {
                    first_name: "Admin",
                    last_name: "CoderHouse",
                    email: email,
                    password: password,
                    age: 99,
                    rol: "Admin"
                }
                return userAdmin
            } else {
                const user = await usersModels.findOne({email:email})
                if (user) {
                    const realPassword = await comparePasswords(password,user.password)
                    if (realPassword) {
                        return user
                    } else{
                        return null
                    }
                } else{
                    return null
                    }
            }
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
}