import { Router } from "express";
import { logoutController } from "../controllers/users.controllers.js";
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

router.get('/logout',logoutController
// (req,res)=>{
//     try {
//         req.session.destroy((error) => {
//           if (error) console.log(error)
//           res.redirect('/')
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }
)
router.get("/githubRegister",passport.authenticate("github",{
    scope:["user:email"]
}))

router.get("/github", passport.authenticate("github"),(req,res)=>{
    req.session.userInfo = req.user
    res.redirect('/products')
});

router.post('/oldRegister',async(req,res)=>{
    const userData = req.body 
    await userManagement.createUser(userData)
})
export default router