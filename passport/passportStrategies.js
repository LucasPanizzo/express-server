import passport from "passport";
import { usersModels } from "../DAO/MongoDB/db/models/users.models.js";
import { Strategy as LocalStrategy } from "passport-local";
import { cryptedPassword,comparePasswords } from "../utilities.js";

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async(req,email,password,done)=>{
    const user = await usersModels.findOne({email})
    if (user) {
        return done(null,false)
    } else {
        const newPassword = await cryptedPassword(password)
        const cryptedUser = {...req.body,password:newPassword}
        const newUser = await usersModels.create(cryptedUser)
        done(null,newUser)
    }
}))

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},async(req,email,password,done)=>{
    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            const userAdmin = {
                first_name: "Admin",
                last_name: "CoderHouse",
                email: email,
                password: password,
                age: 99,
                rol: "Admin"
            }
            return done(null, userAdmin)
        } else {
            const user = await usersModels.findOne({email:email})
            if (user) {
                const realPassword = await comparePasswords(password,user.password)
                if (realPassword) {
                    return done(null,user)
                } else{
                    return done(null,false)
                }
            } else{
                return done(null,false)
                }
        }
    } catch (error) {
        console.log(error);
    }
}))

passport.serializeUser(function(user, done){
    done(null,user._id)
})

passport.deserializeUser(async function(id, done){
    const user = await usersModels.findById(id)
    done(null,user)
})