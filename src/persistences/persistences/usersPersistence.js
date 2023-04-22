
import MongoDB from '../DAOs/MongoDB/users.manager.js'
import userRepository from '../repositories/users.repository.js'

// let persistence = new MongoDB('users', usersModels)
let persistence = new userRepository(MongoDB)

export async function createUser(userData) {
    return await persistence.createUser(userData)
}

export async function getUser(email,password) {
    return await persistence.getUser(email,password)
}

export async function getUserByEmail(email){
    return await persistence.getUserByEmail(email)
}