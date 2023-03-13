import { Router } from "express";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()

router.get('/', async (req,res)=>{
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