import { Router } from "express";
import cartManager from "../controllers/carts.controllers.js";
import ProductManager from "../controllers/products.controllers.js";

const inst = new cartManager
const inst2 = new ProductManager
const router = Router()

router.post('/',async(req,res) =>{
    await inst.addCart()
    res.send('Carrito creado con exito.')
})
router.get('/:idCart',async(req,res) =>{
    const {idCart} = req.params
    const searchedCart = await inst.getCartByID(parseInt(idCart))
    if (searchedCart) {
        res.json({message:'Carrito encontrado',searchedCart})
    } else {
        res.send('El carrito buscado no existe en la base de datos.')
    }
})
router.post('/:cid/product/:pid',async(req,res)=>{
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    const cartsList = await inst.getCarts()
    const productList = await inst2.getProducts()
    const cartFound = await cartsList.find((el)=> el.id === cartId)
    if (cartFound) {
        const productFound = await productList.find((el) => el.id === productId)
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