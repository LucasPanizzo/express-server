import { Router } from "express";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()

router.get('/',(req,res)=>{
    res.render('login')
})

router.get('/registro',(req,res)=>{
    res.render('register')
})

router.get('/perfil',(req,res)=>{
    res.render('profile')
})

router.get('/products', async (req,res)=>{
    res.render('index')
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