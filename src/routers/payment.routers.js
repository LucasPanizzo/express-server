import { Router } from "express";
import { createPreferenceController,failedPaymentController } from "../controllers/payments.controllers.js";
import { purchaseController } from "../controllers/carts.controllers.js";

const router = Router()

router.post('/',createPreferenceController)

router.get('/success',purchaseController)

router.get('/fail', failedPaymentController)

export default router