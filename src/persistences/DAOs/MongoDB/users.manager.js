import CustomError from "../../../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";
import CurrentDTO from "../../DTOs/current.dto.js";
import nodemailer from 'nodemailer'
import config from "../../../config.js";
import { usersModels } from "../../MongoDB/models/users.models.js";
import { cryptedPassword, comparePasswords } from "../../../utilities.js";
import { validateDocuments } from "../../../public/js/validateDocuments.js";
import UsersSecureDTO from "../../DTOs/usersSecureData.dto.js";

// La creación de usuarios nuevos, y el login a la base de datos se hace exclusivamente mediante PASSPORT.

export default class userManager {
    async currentSession(info) {
        try {
            const current = new CurrentDTO(await info)
            return current
        } catch {
            logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.SESSION_ERROR,
                cause: ErrorsCause.SESSION_INVALID_CAUSE,
                message: ErrorsMessage.SESSION_INVALID_ERROR
            });
        }
    }
    async getUserByID(id) {
        try {
            const user = await usersModels.findOne({ _id: id });
            return user;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await usersModels.findOne({ email: email });
            return user;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async getAllUsers() {
        try {
          const users = await usersModels.find();
          const userList = users.map(el => new UsersSecureDTO(el));
          return userList;
        } catch {
          logger.error(ErrorsMessage.USER_WRONGDATA_ERROR);
          throw CustomError.createCustomError({
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
    async passwordForget(email) {
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
            if (user) {

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
        } catch (error) {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async changePassword(userID, newPassword, token) {
        try {
            const user = await this.getUserByID(userID)
            if (user.tokenResetPassword === token) {
                const repeatedPassword = await comparePasswords(newPassword, user.password)
                if (repeatedPassword) {
                    return ('La contraseña nueva no puede ser igual a la anterior')
                } else {
                    const newPasswordCrypted = await cryptedPassword(newPassword)
                    await usersModels.findByIdAndUpdate({ _id: userID }, { password: newPasswordCrypted })
                    return ('Contraseña actualizada con exito.')
                }
            }
            else {
                return ('Error al cambiar la contraseña, el token ha expirado.')
            }
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async changeRol(ID, files) {
        try {
            const changeRol = await this.getUserByID(ID);
            const validation = validateDocuments(files);
            if (changeRol.rol === "User" && validation) {
                const newRole = await usersModels.updateOne(
                    { _id: ID },
                    { rol: "Premium" }
                );
                return newRole;
            } else if (changeRol.rol === "Premium") {
                const newRole = await usersModels.updateOne(
                    { _id: ID },
                    { rol: "User" }
                );
                return newRole;
            } else {
                logger.error(ErrorsMessage.USER_NEEDDOCUMENTS_ERROR);
                throw CustomError.createCustomError({
                    name: ErrorsName.USER_ERROR,
                    cause: ErrorsCause.USER_NEEDDOCUMENTS_CAUSE,
                    message: ErrorsMessage.USER_NEEDDOCUMENTS_ERROR
                });
            }
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR);
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }

    async uploadFiles(uid, files) {
        try {
            const user = await this.getUserByID(uid);
            const existingFiles = user.documents || [];
            const updatedFiles = existingFiles.concat(files);
            const uploadedFiles = await usersModels.findByIdAndUpdate(uid, { documents: updatedFiles }, { new: true });
            return uploadedFiles;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR);
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR,
            });
        }
    }
    async updateLastConnection(uid) {
        try {
            const lastDate = new Date(Date.now()).toISOString();
            const userUpdated = await usersModels.findByIdAndUpdate(uid, { lastConnection: lastDate }, { new: true })
            return userUpdated
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    async deleteInactiveUsers() {
        try {
            const inactiveThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
            const inactiveUsers = await usersModels.find({ lastConnection: { $lt: inactiveThreshold } });
            await usersModels.deleteMany({ lastConnection: { $lt: inactiveThreshold } });
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: config.GCOUNT[0],
                    pass: config.GCOUNT[1]
                }
            });
            const deleteEmails = inactiveUsers.map(async (user) => {
                await transport.sendMail({
                    from: "<lucas.panizzo99@gmail.com>",
                    to: user.email,
                    subject: 'Eliminación de cuenta por inactividad',
                    html: `
                <div>
                  <p>Tu cuenta ha sido eliminada debido a la inactividad.</p>
                  <p>Si deseas volver a utilizar nuestros servicios, por favor regístrate nuevamente.</p>
                </div>
              `
                });
            });
            await Promise.all(deleteEmails);
            return inactiveUsers;
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }
    
}
