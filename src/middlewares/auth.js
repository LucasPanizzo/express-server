import { currentSessionService } from "../services/users.services.js"
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";

async function getRole(info) {
  try {
    const sessionInfo = await currentSessionService(info)
    return sessionInfo.rol
  } catch {
    logger.error(ErrorsMessage.SESSION_INVALID_ERRO)
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.SESSION_INVALID_CAUSE,
      message: ErrorsMessage.SESSION_INVALID_ERROR
    });
  }
}

export const verificarAdminOPremium = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'admin'||"premium") {
    next()
  } else {
    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
    });
  }
}

export const verificarUserOPremium = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'user'||"premium") {
    next()
  } else {
    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
    });
  }
}

export const verificarPremium = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'premium') {
    next()
  } else {
    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
    });
  }
}

export const verificarAdmin = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'admin') {
    next()
  } else {
    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
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
    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
    CustomError.createCustomError({
      name: ErrorsName.SESSION_ERROR,
      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
    });
  }
}