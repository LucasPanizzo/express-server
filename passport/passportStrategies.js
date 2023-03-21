import passport from "passport";
import { usersModels } from "../DAO/MongoDB/db/models/users.models.js";
import { Strategy as LocalStrategy } from "passport-local";
import { cryptedPassword,comparePasswords } from "../utilities.js";
import { Strategy as GithubStrategy } from "passport-github2";

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

passport.use('github',new GithubStrategy({
    clientID: 'Iv1.e71eacd9d90eaee2',
    clientSecret: '9cb7305941acbe07da82f8e06f3f3539c50c747e',
    callbackURL: 'http://localhost:3030/api/users/github'
},async( accessToken, refreshToken, profile, done)=>{
    const user = await usersModels.findOne({email:profile._json.email})
    if(!user){
        const userData = {
            first_name:profile._json.name.split('')[0],
            last_name:profile._json.name.split('')[1] || '',
            email:profile._json.email,
            password:'',          
        }
        const newUser = await usersModels.create(userData);
        done(null,newUser)
    }else{
        done(null,user)
    }
    
}))

passport.serializeUser(function(user, done){
    done(null,user._id)
})

passport.deserializeUser(async function(id, done){
    const user = await usersModels.findById(id)
    done(null,user)
})
 
//Owned by: @LucasPanizzo

// App ID: 308231

// Client ID: Iv1.e71eacd9d90eaee2

// Secret: 9cb7305941acbe07da82f8e06f3f3539c50c747e