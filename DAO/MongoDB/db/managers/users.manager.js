import { usersModels } from "../models/users.models.js";
import { cryptedPassword,comparePasswords } from "../../../../utilities.js";
import { trusted } from "mongoose";

export default class userManager {
    async createUser(userData) {
        try {
            const {password} = userData
            const newPassword = await cryptedPassword(password)
            const cryptedUser = {...userData,password:newPassword}
            const newUser = await usersModels.create(cryptedUser)
            return newUser
        } catch (error) {
            console.log(error);
        }
    }
    async getUser(email,password) {
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
                return userAdmin
            } else {
                const user = await usersModels.findOne({email:email})
                if (user) {
                    const realPassword = await comparePasswords(password,user.password)
                    if (realPassword) {
                        return user
                    } else{
                        return null
                    }
                } else{
                    return null
                    }
            }
        } catch (error) {
            console.log(error);
        }
    }
}