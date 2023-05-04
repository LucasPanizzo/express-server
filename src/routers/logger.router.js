import { Router } from "express";
import { loggerTestController } from "../controllers/logger.controllers.js";

const router = Router()

router.get('/',loggerTestController)

export default router