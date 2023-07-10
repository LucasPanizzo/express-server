import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { passwordForgetService, changePasswordService, getUserByIDService, changeRolService, uploadFilesService, updateLastConnectionService, deleteInactiveUsersService,getAllUsersService,deleteUserByIDService, currentSessionService } from "../services/users.services.js";
import { adminChecker } from "../public/js/adminChecker.js";
export const logoutController = async (req, res) => {
    try {
        const id = await req.session.userInfo._id
        await updateLastConnectionService(id)
        req.session.destroy((error) => {
            if (error) console.log(error)
            res.redirect('/')
        })
    } catch{
        logger.error(ErrorsMessage.SESSION_INVALID_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.SESSION_ERROR,
            cause: ErrorsCause.SESSION_INVALID_CAUSE,
            message: ErrorsMessage.SESSION_INVALID_ERROR
        });
    }
}
export const getUserByIdController = async (req, res) => {
    try {
        const id = req.params.uid
        const user = await getUserByIDService(id)
        res.send(user)
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}
export const getAllUsersController = async (req,res)=>{
    try {
        const users = await getAllUsersService()
        console.log(users);
        res.send(users)
    } catch{
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });  
    }
}
export const deleteUserByIDController = async (req,res)=>{
    try {
        const id = req.params.uid
        const deletedUser = await deleteUserByIDService(id)
        res.json({ message: 'Usuario eliminado con exito', deletedUser })
    } catch{
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });  
    }
}
export const passwordForgetController = async (req, res) => {
    try {
        await passwordForgetService(req.body.email)
        res.json({ message: `Un correo de recuperación ha sido envíado a tu email, revisa la bandeja de entrada.` })
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}
export const changePasswordController = async (req, res) => {
    try {
        const response = await changePasswordService(req.params.uid, req.body.password, req.params.token)
        res.json({ message: response })
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}

export const recoveryPasswordViewController = async (req, res) => {
    try {
        const id = req.params.uid
        const user = await getUserByIDService(id)
        const token = req.params.token
        let condition
        if (token !== user.tokenResetPassword) {
            condition = false
        } else {
            condition = true
        }
        res.render('changePassword', { id, token, condition })
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}

export const changeUserRolController = async (req, res) => {
    try {
        const id = req.params.uid
        const user = await getUserByIDService(id)
        const files = user.documents
        const newRol = await changeRolService(id, files)
        res.json({ message: 'Rol actualizado con exito', newRol })
    } catch {
        logger.error(ErrorsMessage.USER_NEEDDOCUMENTS_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_NEEDDOCUMENTS_CAUSE,
            message: ErrorsMessage.USER_NEEDDOCUMENTS_ERROR
        });
    }
}


export const uploadFilesController = async (req, res) => {
    const userId = req.params.uid;
    const documents = req.files;
    let documentsToUpload = [];
    const processUploadedFiles = (fieldname) => {
        if (documents?.[fieldname]) {
            documents[fieldname].forEach((el) => {
                documentsToUpload.push({ name: el.filename, reference: el.path });
            });
        }
    };
    processUploadedFiles("profile");
    processUploadedFiles("product");
    processUploadedFiles("identificacion");
    processUploadedFiles("domicilio");
    processUploadedFiles("cuentaStatus");
    try {
        const user = await uploadFilesService(userId, documentsToUpload);
        res.json({ message: "Sus documentos han sido subidos correctamente", user });
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        }); 
    }
};

export const deleteInactiveUsersController = async (req,res) => {
    try {
        const deletedUsers = await deleteInactiveUsersService()
        res.json({ message: "Usuarios inactivos eliminados con éxito.", deletedUsers })
    } catch {
        logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_WRONGDATA_CAUSE,
            message: ErrorsMessage.USER_WRONGDATA_ERROR
        });
    }
}
export const writeUsersController = async (req, res) => {
    try {
        const user = await currentSessionService(req.session.userInfo)
        const rol = user.rol
        const isAdmin = adminChecker(rol)
        const userList = await getAllUsersService()
        res.render('usersManagement', { "users": userList,isAdmin })
    } catch {
        throw CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
            message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
        });
    }
}