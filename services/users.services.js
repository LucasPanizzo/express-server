import { createUser,getUser } from "../DAO/Persistences/usersPersistence.js";

export async function createUserService(user){
    const newUser = await createUser(user)
    return newUser
}

export async function getUserService(email, password){
    const user = getUser(email, password)
    return user
}