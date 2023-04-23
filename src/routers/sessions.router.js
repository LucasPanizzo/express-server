import { Router } from "express";
import { currentSession } from "../controllers/sessions.controllers.js";
import { verificarUsuario } from "../middlewares/auth.js";

const router = Router()

router.get("/current",currentSession)
router.get("/",verificarUsuario,(req,res)=>{
    console.log('si');
})

export default router