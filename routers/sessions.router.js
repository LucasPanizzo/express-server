import { Router } from "express";

const router = Router()

router.get("/current", async (req,res)=>{
    res.json(req.session)
})

export default router