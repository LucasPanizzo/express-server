import { Router } from "express";
import { generateToken } from "../utilities.js";
import userManager from "../DAO/MongoDB/db/managers/users.manager.js";

const userController = new userManager
const router = Router()

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;  
    const user = await userController.getUser(email,password);
    if(user){
        const token = generateToken(user);
        res.json({token})
    }
    else{
        res.json({mensaje:"error logeo"});
    }
    
})

export default router