import { Router } from "express";
import { logoutController,passwordForgetController,changePasswordController,changeUserRolController } from "../controllers/users.controllers.js";
import passport from "passport";

const router = Router()

router.post('/register',passport.authenticate('register',{
    failureRedirect: '/registerWrong',
    successRedirect: '/',
    passReqToCallback:true
}))

router.post('/passwordForget',passwordForgetController)

router.post('/changePassword/:uid/:token',changePasswordController)

router.get('/changeRol',changeUserRolController)
 
router.post('/login',
passport.authenticate('login',{
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
export default router