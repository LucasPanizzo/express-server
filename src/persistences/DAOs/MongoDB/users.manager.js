import { usersModels } from "../../MongoDB/models/users.models.js";
import { cryptedPassword,comparePasswords } from "../../../utilities.js";
import config from "../../../config.js";

export default class userManager {
    async createUser(user) {
        try {
            const newUser = await usersModels.create(user)
            return newUser
        } catch (error) {
            console.log(error);
        }
    }
    async getUser(email,password) {
        try {
            if (email === config.ADMINMAIL && password === config.ADMINPASSWORD) {
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