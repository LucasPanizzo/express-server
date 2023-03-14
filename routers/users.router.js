import { Router } from "express";
import { userManager } from "../DAO/MongoDB/db/controllers/users.controllers.js";

const router = Router()
const userManagement = new userManager()

router.get("/",(req,res)=>{
    res.json(req.session)
})
router.post('/register',async(req,res)=>{
    try {
        console.log(req.body);
        const userData = req.body
        const exists = await userManagement.getUser(userData)
        console.log(exists);
        if (exists) {
            res.render("registerWrong")
        } else {
            const newUser = await userManagement.createUser(userData)
            if (newUser) {
                res.redirect("/")
            } else {
                res.render("registerWrong")
            } 

        }
    } catch (error) {
        
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body
        const userLoged = await userManagement.getUser(email,password)
        if (userLoged) {
            console.log(userLoged);
            res.redirect("/products")
        } else {
            res.render("loginWrong")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/logout',(req,res)=>{
    try {
        req.session.destroy()
        console.log('destroyed');
    } catch (error) {
        console.log(error);
    }
})

export default router