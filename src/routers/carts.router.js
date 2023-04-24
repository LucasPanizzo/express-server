import { Router } from "express";
import { getUserCart,getCartController,addCartController,getCartByIDController,addToCartController,deleteProductController,emptyCartController,updateProductsInCartController,modifyProductQuantityController,purchaseController } from "../controllers/carts.controllers.js";
import { verificarUsuario } from "../middlewares/auth.js";
import cartManager from "../persistences/DAOs/MongoDB/carts.manager.js";

const inst = new cartManager

const router = Router()

router.get('/purchase/:cid',purchaseController)

router.get('/getUserCart',getUserCart)

router.post('/',addCartController)

router.get('/',getCartController)

router.get('/:cid',getCartByIDController
// async(req,res) =>{
//     const {idCart} = req.params
//     const searchedCart = await inst.findCartAndPoblate(idCart)
//     if (searchedCart) {
//         const cartProducts = searchedCart[0].products
//         res.json({message:'Carrito encontrado',cartProducts})
//     } else {
//         res.send('El carrito buscado no existe en la base de datos.')
//     }
// }
)
router.post('/:cid/product/:pid',verificarUsuario,addToCartController
// async(req,res)=>{
//     const cartId = req.params.cid
//     const productId = req.params.pid
//     const cartFound = await inst.getCartByID(cartId)
//     if (cartFound) {
//         const productFound = await inst2.getProductsByID(productId)
//         if (productFound) {
//             await inst.addToCart(cartId,productId)
//             res.send('Producto agregado con exito.')
//         } else {
//             res.send('El producto que quieres agregar no existe')
//         }
//     } else {
//         res.send('El carrito buscado no existe')
//     }

// }
)
router.delete('/:cid',emptyCartController
// async(req,res)=>{
//     const cartId = req.params.cid
//     const cartFound = await inst.getCartByID(cartId)
//     if (cartFound) {
//             await inst.emptyCart(cartId)
//             res.send('Carrito vaciado con exito.')
//     } else {
//         res.send('El carrito buscado no existe')
//     }
// }
)
router.delete('/:cid/product/:pid',deleteProductController
// async(req,res)=>{
//     const cartId = req.params.cid
//     const productId = req.params.pid
//     const cartFound = await inst.getCartByID(cartId)
//     if (cartFound) {
//         const productFound = await inst.findProductInCart(cartId,productId)
//         if (productFound) {
//             await inst.deleteProduct(cartId,productId)
//             res.send('Producto eliminado con exito.')
//         } else {
//             res.send('El producto que quieres eliminar no se encuentra en el carrito.')
//         }
//     } else {
//         res.send('El carrito buscado no existe')
//     }
// }
)
router.put('/:cid/product/:pid',modifyProductQuantityController
// async(req,res)=>{
//     const cartId = req.params.cid
//     const productId = req.params.pid
//     const quantity = parseInt(req.body)
//     const cartFound = await inst.getCartByID(cartId)
//     if (cartFound) {
//         const productFound = await inst.findProductInCart(cartId,productId)
//         if (productFound) {
//             await inst.modifyProductQuantity(cartId,productId,quantity)
//             res.send('Cantidad modificada con exito.')
//         } else {
//             res.send('El producto que quieres eliminar no existe')
//         }
//     } else {
//         res.send('El carrito buscado no existe')
//     }
// }
)
router.put('/:cid',updateProductsInCartController
// async(req,res)=>{
//     const cartId = req.params.cid
//     const products = req.body
//     await inst.updateProductsInCart(products,cartId)
//     res.send('Carrito modificado con exito.')
// }
)
export default router