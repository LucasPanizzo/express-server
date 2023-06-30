import { Router } from "express";
import { logoutController, passwordForgetController, changePasswordController, changeUserRolController, uploadFilesController,getUserByIdController,deleteInactiveUsersController,getAllUsersController,deleteUserByIDController } from "../controllers/users.controllers.js";
import passport from "passport";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.get('/',getAllUsersController)

router.delete('/',deleteInactiveUsersController)

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/registerWrong',
    successRedirect: '/',
    passReqToCallback: true
}))

router.post('/passwordForget', passwordForgetController)

router.post('/changePassword/:uid/:token', changePasswordController)

router.get('/changeRol/:uid', changeUserRolController)

router.post('/login',
    passport.authenticate('login', {
        failureRedirect: "/loginWrong",
        passReqToCallback: true
    }), async (req, res) => {
        req.session.userInfo = req.user
        res.redirect('/products')
    })

router.get('/logout', logoutController)

router.get("/githubRegister", passport.authenticate("github", {
    scope: ["user:email"]
}))

router.get("/github", passport.authenticate("github"), (req, res) => {
    req.session.userInfo = req.user
    res.redirect('/products')
});

router.post("/:uid/documents", upload.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "domicilio", maxCount: 1 },
    { name: "cuentaStatus", maxCount: 1 },
    { name: "profile", maxCount: 1 },
    { name: "product", maxCount: 3 }
]), uploadFilesController);

router.get('/:uid',getUserByIdController)

router.delete('/:uid',deleteUserByIDController)

export default router