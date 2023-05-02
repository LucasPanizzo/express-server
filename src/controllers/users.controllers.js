import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
export const logoutController = (req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}