import { Router } from "express";
import { createPreferenceController,receiveWebhookController,failedPaymentController } from "../controllers/payments.controllers.js";
import { purchaseController } from "../controllers/carts.controllers.js";

const router = Router()

router.post('/',createPreferenceController)

router.post("/webhook", receiveWebhookController);

router.get('/success',purchaseController)

router.get('/fail', failedPaymentController)

export default router