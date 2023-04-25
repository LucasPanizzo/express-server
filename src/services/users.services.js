import { createUser,getUser,currentSession } from "../persistences/persistences/usersPersistence.js";

export async function createUserService(user){
    const newUser = await createUser(user)
    return newUser
}

export async function getUserService(email, password){
    const user = getUser(email, password)
    return user
}

export async function currentSessionService(info){
    const session = currentSession(info)
    return session
}