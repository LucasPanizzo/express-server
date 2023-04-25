import { Router } from "express";
import { currentSession } from "../controllers/sessions.controllers.js";

const router = Router()

router.get("/current",currentSession)


export default router