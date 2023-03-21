import { Router } from "express";
import { userManager } from "../DAO/MongoDB/db/controllers/users.controllers.js";
import passport from "passport";

const router = Router()
const userManagement = new userManager()

router.post('/register',passport.authenticate('register',{
    failureRedirect: '/registerWrong',
    successRedirect: '/',
    passReqToCallback:true
}))

router.post('/login',passport.authenticate('login',{
    failureRedirect:"/loginWrong",
    passReqToCallback:true
}),async(req,res)=>{
    req.session.userInfo = req.user
    res.redirect('/products')
})

router.get('/logout',(req,res)=>{
    try {
        req.session.destroy((error) => {
          if (error) console.log(error)
          res.redirect('/')
        })
    } catch (error) {
        console.log(error);
    }
})

export default router