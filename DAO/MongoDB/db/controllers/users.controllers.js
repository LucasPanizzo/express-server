import { usersModels } from "../models/users.models.js";

export class userManager {
    async createUser(userData) {
        try {
            console.log(userData);
            const newUser = await usersModels.create(userData)
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
                const user = await usersModels.find({ email, password })
                if (user.length !== 0) {
                    return user
                } else {
                    return null
                }
            }
        } catch (error) {

        }
    }
}