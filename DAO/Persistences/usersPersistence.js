import MongoDB from '../MongoDB/db/controllers/carts.controllers.js'
import { usersModels } from '../MongoDB/db/models/users.models.js'

let persistence = new MongoDB('Products', usersModels)

export async function createUser(userData) {
    return await persistence.createUser(userData)
}

export async function getUser(email,password) {
    return await persistence.getUser(email,password)
}