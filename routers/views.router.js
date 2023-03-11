import { Router } from "express";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()

router.get('/', async (req,res)=>{
    const {limit,page,sort,...query} = req.query
    const products = await inst.getProducts(limit,page,sort,query)
    const productsPayload = products.payload
    console.log(productsPayload);
    res.render('index',{productsPayload})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',async(req,res)=>{
    res.render('chat')
})

export default router