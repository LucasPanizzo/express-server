import MongoDB from '../DAOs/MongoDB/users.manager.js'
import {usersModels} from '../MongoDB/models/users.models.js'

let persistence = new MongoDB('users', usersModels)

export async function currentSession(info){
    return await persistence.currentSession(info)
}

export async function passwordForget(email){
    return await persistence.passwordForget(email)
}

export async function changePassword(userID,newPassword,token){
    return await persistence.changePassword(userID,newPassword,token)
}

export async function getUserByID(userID){
    return await persistence.getUserByID(userID)
}

export async function changeRol(userID){
    return await persistence.changeRol(userID)
}