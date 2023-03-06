import { Router } from "express";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()

router.get('/',async(req,res)=>{
    const {page=1, limit=10, category,status} = req.query
    let products = await inst.getProducts().paginate({category:category,status:status},{limit,page})
    res.render('index',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})


router.get('/chathandlebars',async(req,res)=>{
    res.render('chat')
})

export default router