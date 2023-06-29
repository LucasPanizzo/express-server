import { currentSession,passwordForget,changePassword,getUserByID,changeRol,uploadFiles,updateLastConnection,deleteInactiveUsers,getAllUsers } from "../persistences/persistences/usersPersistence.js";

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

export async function getAllUsersService(){
    const users = getAllUsers()
    return users
}

export async function changeRolService(userID,files){
    const newRol = changeRol(userID,files)
    return newRol
}

export async function uploadFilesService(userID,files){
    const docs = uploadFiles(userID,files)
    return docs
}

export async function updateLastConnectionService(userID){
    const lastConnection = updateLastConnection(userID)
    return lastConnection
}

export async function deleteInactiveUsersService(){
    const inactiveUsers = deleteInactiveUsers()
    return inactiveUsers
}