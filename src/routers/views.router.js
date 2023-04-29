import { Router } from "express";
import { verificarUsuario } from "../middlewares/auth.js";
import { writeProductsController } from "../controllers/products.controllers.js";
import { writeCartsController } from "../controllers/carts.controllers.js";
import { currentSessionService } from "../services/users.services.js";

const router = Router()

router.get('/',(req,res)=>{
    res.render('login')
})

router.get('/registro',(req,res)=>{
    res.render('register')
})

router.get('/perfil',(req,res)=>{
    res.render('profile',req.session.userInfo)
})

router.get('/loginWrong',(req,res)=>{
    res.render('loginWrong')
})

router.get('/registerWrong',(req,res)=>{
    res.render('registerWrong')
})

router.get('/products',writeProductsController)

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',async(req,res)=>{
    const userInfo = await currentSessionService(req.session.userInfo)
    let condition
    if (userInfo.rol === "user") {
        condition = true
    } else {
        condition = false
    }
    res.render('chat',{"user":userInfo,"condition":condition})
})

router.get('/cart',writeCartsController)

export default router