import { Router } from "express";

import fs from 'fs';
import ProductManager from "../controllers/products.controllers.js";

const inst = new ProductManager
const router = Router()
const path = './database/products.json'

router.get('/',async(req,res)=>{
    let products = await inst.getProducts()
    res.render('index',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realtimeproducts')
})
export default router