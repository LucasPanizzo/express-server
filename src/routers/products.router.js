import {Router } from "express";
import { getProductsController,getProductsByIDController,addProductController,deleteProductController,updateProductController } from "../controllers/products.controllers.js";
import { verificarAdmin,verificarAdminOPremium } from "../middlewares/auth.js";

const router = Router()

router.get('/', getProductsController)

router.get('/:idProduct',getProductsByIDController)

router.post('/',
// verificarAdminOPremium,
addProductController)

router.delete('/:idProduct',
//verificarAdminOPremium,
deleteProductController)

router.put('/:idProduct',
//verificarAdmin,
updateProductController)

export default router