import { currentSessionService } from "../services/users.services.js"

async function getRole(info) {
  const sessionInfo = await currentSessionService(info)
  return sessionInfo.rol
}


export const verificarAdmin = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'admin') {
    next()
  } else {
    console.log('No estas autorizado para realizar esta operacion')
  }
}

export const verificarUsuario = async (req, res, next) => {
  const sessionRol = await getRole(req.session.userInfo)
  if (sessionRol === 'user') {
    next()
  } else {
    console.log('No estas autorizado para realizar esta operacion')
  }
}