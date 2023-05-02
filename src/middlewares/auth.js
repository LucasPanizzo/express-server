import { currentSessionService } from "../services/users.services.js"
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";

async function getRole(info) {
  const sessionInfo = await currentSessionService(info)
  return sessionInfo.rol
}


export const verificarAdmin = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'admin') {
    next()
  } else {
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
  });
  }
}

export const verificarUsuario = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'user') {
    next()
  } else {
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
  });
  }
}