import { Router } from "express";
import cartManager from "../DAO/MongoDB/db/controllers/carts.controllers.js";
import ProductManager from "../DAO/MongoDB/db/controllers/products.controllers.js";

const inst = new cartManager
const inst2 = new ProductManager
const router = Router()

router.post('/',async(req,res) =>{
    await inst.addCart()
    res.send('Carrito creado con exito.')
})

router.get('/:idCart',async(req,res) =>{
    const {idCart} = req.params
    const searchedCart = await inst.getCartByID(idCart)
    if (searchedCart) {
        res.json({message:'Carrito encontrado',searchedCart})
    } else {
        res.send('El carrito buscado no existe en la base de datos.')
    }
})
router.post('/:cid/product/:pid',async(req,res)=>{
    const cartId = req.params.cid
    const productId = req.params.pid
    const cartFound = await inst.getCartByID(cartId)
    if (cartFound) {
        const productFound = await inst2.getProductsByID(productId)
        if (productFound) {
            await inst.addToCart(cartId,productId)
            res.send('Producto agregado con exito.')
        } else {
            res.send('El producto que quieres agregar no existe')
        }
    } else {
        res.send('El carrito buscado no existe')
    }

})
export default router