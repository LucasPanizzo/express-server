import CustomError from "../../../errors/newError.js";
import { ErrorsCause,ErrorsMessage,ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";
import CurrentDTO from "../../DTOs/current.dto.js";
import nodemailer from 'nodemailer'
import config from "../../../config.js";
import { usersModels } from "../../MongoDB/models/users.models.js";
import { cryptedPassword,comparePasswords } from "../../../utilities.js";

// La creación de usuarios nuevos, y el login a la base de datos se hace exclusivamente mediante PASSPORT.

export default class userManager {
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
    async getUserByID(id) {
        try {
            const user = await usersModels.findOne({ id:id });
            return user;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await usersModels.findOne({ email:email });
            return user;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async #generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }
    async passwordForget(email){
        try {
            const user = await this.getUserByEmail(email)
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: config.GCOUNT[0],
                    pass: config.GCOUNT[1]
                }
            })
            if (user){

                const code = await this.#generateRandomCode(10); // Genera un código aleatorio de longitud 10
                const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de expiración
                  await usersModels.findByIdAndUpdate(
                    { _id: user._id },
                    { tokenResetPassword: code, tokenExpiration: expirationDate }
                  );
                let email = await transport.sendMail({
                    from: "<lucas.panizzo99@gmail.com>",
                    to: user.email,
                    subject: 'Reestablecer Contraseña',
                    html: `
                        <div>
                            <p>Para reestablecer tu contraseña ingresa en el siguiente link:</p>
                            <a href="http://localhost:3030/recoveryPassword/${user._id}/${code}">Click aquí</a>
                            <p>Tienes una hora para actualizar tu contraseña, en caso de no hacerlo a tiempo, puedes pedir un reenvío del Token.</p>
                        </div>
                    `
                })
                setTimeout(async () => {
                    await usersModels.findByIdAndUpdate(
                        { _id: user[0]._id },
                        { tokenResetPassword: null, tokenExpiration: null }
                    );
                }, 60 * 60 * 1000);
                return email;

            }
        } catch(error) {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });  
        }
    }
    async changePassword (userID,newPassword,token){
        try {
            const user = await this.getUserByID(userID)
            if(user.tokenResetPassword === token){
                const repeatedPassword = await comparePasswords(newPassword, user.password)
                if (repeatedPassword) {
                    return('La contraseña nueva no puede ser igual a la anterior')
                } else {
                    const newPasswordCrypted = await cryptedPassword(newPassword)
                    await usersModels.findByIdAndUpdate({_id:userID},{password:newPasswordCrypted})
                    return('Contraseña actualizada con exito.')
                }
            }
            else{
                return ('Error al cambiar la contraseña, el token ha expirado.')
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
    async changeRol(ID) {
        try {
            const changeRol = await this.getUserByID(ID)
            if(changeRol.rol === "User") {
                const newRole = usersModels.updateOne(
                    {_id: ID},
                    {rol: "Premium"}
                )
                return newRole;
            } else {
                const newRole = usersModels.updateOne(
                    {_id: ID},
                    {rol: "User"}
                )
                return newRole;
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
