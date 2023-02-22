import { Router } from "express";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()

router.get('/',async(req,res)=>{
    let products = await inst.getProducts()
    res.render('index',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',async(req,res)=>{
    res.render('chat')
})

export default router