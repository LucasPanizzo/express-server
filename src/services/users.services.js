import { currentSession,passwordForget,changePassword,getUserByID,changeRol } from "../persistences/persistences/usersPersistence.js";

export async function currentSessionService(info){
    const session = currentSession(info)
    return session
}

export async function passwordForgetService(email){
    const emailSend = passwordForget(email)
    return emailSend
}

export async function changePasswordService(userID,newPassword,token){
    const newUser = changePassword(userID,newPassword,token)
    return newUser
}

export async function getUserByIDService(userID){
    const user = getUserByID(userID)
    return user
}

export async function changeRolService(userID){
    const newRol = changeRol(userID)
    return newRol
}