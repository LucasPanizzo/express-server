import passport from "passport";
import mongoose from "mongoose";
import config from "../config.js";
import { usersModels } from '../persistences/MongoDB/models/users.models.js'
import { Strategy as LocalStrategy } from "passport-local";
import { cryptedPassword, comparePasswords } from "../utilities.js";
import { Strategy as GithubStrategy } from "passport-github2";
import { addCartService } from "../services/carts.services.js"
import UsersDTO from "../persistences/DTOs/users.dto.js";
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await usersModels.findOne({ email })
        if (user) {
            return done(null, false)
        } else {
            const userClean = new UsersDTO(req.body)
            const addedCart = await addCartService()
            const newPassword = await cryptedPassword(password)
            const cryptedUser = { ...userClean, password: newPassword, userCart: addedCart._id }
            const newUser = await usersModels.create(cryptedUser)
            done(null, newUser)
        }
    } catch{
        logger.error(ErrorsMessage.USER_ADD_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_ADD_CAUSE,
            message: ErrorsMessage.USER_ADD_ERROR
        });
    }
}))

passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            if (email === config.ADMINMAIL && password === config.ADMINPASSWORD) {
                const userAdmin = {
                    first_name: "Admin",
                    last_name: "CoderHouse",
                    email: email,
                    rol: "admin",
                    userCart: mongoose.Types.ObjectId('64385f342ae1be1ab440d62b')
                }
                return done(null, userAdmin)
            } else {
                const user = await usersModels.findOne({ email: email })
                if (user) {
                    const realPassword = await comparePasswords(password, user.password)
                    if (realPassword) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                } else {
                    return done(null, false)
                }
            }
        } catch {
            logger.error(ErrorsMessage.USER_WRONGDATA_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.USER_ERROR,
                cause: ErrorsCause.USER_WRONGDATA_CAUSE,
                message: ErrorsMessage.USER_WRONGDATA_ERROR
            });
        }
    }))

passport.use('github', new GithubStrategy({
    clientID: 'Iv1.e71eacd9d90eaee2',
    clientSecret: '9cb7305941acbe07da82f8e06f3f3539c50c747e',
    callbackURL: 'http://localhost:3030/api/users/github'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await usersModels.findOne({ email: profile._json.email })
        const addedCart = await addCartService()
        if (!user) {
            const userData = {
                first_name: profile._json.name.split(" ")[0],
                last_name: profile._json.name.split(" ")[1] || " ",
                email: profile._json.email,
                password: " ",
                userCart: addedCart._id
            }
    
            const newUser = await usersModels.create(userData);
            done(null, newUser)
        } else {
            done(null, user)
        }
    
    } catch {
        logger.error(ErrorsMessage.USER_ADD_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.USER_ERROR,
            cause: ErrorsCause.USER_ADD_CAUSE,
            message: ErrorsMessage.USER_ADD_ERROR
        });
    }
}))

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(async function (id, done) {
    const user = await usersModels.findById(id)
    done(null, user)
})

