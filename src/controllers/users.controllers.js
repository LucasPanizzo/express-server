import { getUserByEmailService } from "../services/users.services.js"

export const logoutController = (req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch (error) {
        console.log(error);
    }
}

export const getUserByEmailController = async (req,res)=>{
    try {
        const {email} = req.session.userInfo
        const user = await getUserByEmailService(email)
        return user
    } catch (error) {
        console.log(error);
    }
}