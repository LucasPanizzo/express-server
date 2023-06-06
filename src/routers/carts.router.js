import { Router } from "express";
import { getUserCart,getCartsController,addCartController,getCartByIDController,addToCartController,deleteProductController,emptyCartController,updateProductsInCartController,modifyProductQuantityController,purchaseController } from "../controllers/carts.controllers.js";
import { verificarUserOPremium } from "../middlewares/auth.js";

const router = Router()

router.get('/purchase/:cid',purchaseController)

router.get('/getUserCart',getUserCart)

router.post('/',addCartController)

router.get('/',getCartsController)

router.get('/:cid',getCartByIDController)

router.post('/:cid/product/:pid',verificarUserOPremium,addToCartController)

router.delete('/:cid',emptyCartController)

router.delete('/:cid/product/:pid',deleteProductController)

router.put('/:cid/product/:pid',modifyProductQuantityController)

router.put('/:cid',updateProductsInCartController)

export default router