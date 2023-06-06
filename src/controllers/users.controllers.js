import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { passwordForgetService,changePasswordService, getUserByIDService ,changeRolService} from "../services/users.services.js";
export const logoutController = (req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch {
        logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}
export const passwordForgetController = async (req,res)=>{
    try {
        await passwordForgetService(req.body.email)
        res.json({ message: `Un email de recuperación ha sido envíado a tu email, revisa la bandeja de entrada.` })
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });  
    }
}

export const changePasswordController = async(req,res)=>{
    try {
        const response = await changePasswordService(req.params.uid,req.body.password,req.params.token)
        res.json({message:response})
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}

export const recoveryPasswordViewController = async(req,res)=>{
    try {
        const id = req.params.uid
        const user = await getUserByIDService(id)
        const token = req.params.token
        let condition
        if (token !== user.tokenResetPassword) {
            condition = false
        } else{
            condition = true
        }
        res.render('changePassword',{id,token,condition})
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}

export const changeUserRolController = async(req,res)=>{
    try {
        const id = await req.session.userInfo._id
        const newRol = await changeRolService(id)
        res.send(newRol)
    } catch (error){ 
        console.log(error);
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}