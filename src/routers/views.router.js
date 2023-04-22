import { Router } from "express";

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
    res.render('index',req.session.userInfo)
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',async(req,res)=>{
    res.render('chat')
})

router.get('/cart',(req,res)=>{
    res.render('cart')
})

export default router