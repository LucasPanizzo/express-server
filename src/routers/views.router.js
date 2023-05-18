import { Router } from "express";
import { mockingProductsController } from "../controllers/products.controllers.js";
import { writeProductsController } from "../controllers/products.controllers.js";
import { writeCartsController } from "../controllers/carts.controllers.js";
import { chatControllers } from "../controllers/chats.controllers.js"
import { recoveryPasswordViewController } from "../controllers/users.controllers.js";

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


router.get('/chathandlebars',chatControllers)

router.get('/cart',writeCartsController)

router.post('/mockingproducts',mockingProductsController)

router.get('/recoveryPassword/:uid/:token',recoveryPasswordViewController)

export default router