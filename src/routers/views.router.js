import { Router } from "express";
import { verificarUsuario } from "../middlewares/auth.js";
import { getProductsService } from "../services/products.services.js";

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

router.get('/products', async (req,res)=>{
    const { limit, page, sort, ...query } = req.query
    const products = await getProductsService(limit,page,sort,query)
    const productsList = await products.payload.map(product => Object.assign({}, product._doc))
    res.render('index',{"session":req.session.userInfo,"products":productsList})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',verificarUsuario,async(req,res)=>{
    res.render('chat')
})

router.get('/cart',(req,res)=>{
    res.render('cart')
})

export default router