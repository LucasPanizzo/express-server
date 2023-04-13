import FileManager from '../FyleSystem/managers/products.manager.js'
import MongoDB from '../MongoDB/db/managers/products.manager.js'
import { productsModels } from '../MongoDB/db/models/products.models.js'
import config from '../../config.js'


let persistence

let argv = config.PERSISTENCES[0]

switch (argv) {
    case 'fs':
        persistence = new FileManager('../FyleSystem/database/products.json')
        break;
    case 'mongo':
        persistence = new MongoDB('Products', productsModels)
        break;
    default:
        break;
}

export async function getProducts(limit, page, sort, query) {
    return await persistence.getProducts(limit, page, sort, query)
}

export async function getProductsByID(productID) {
    return await persistence.getProductsByID(productID)
}

export async function addProduct(product) {
    return await persistence.addProduct(product)
}

export async function deleteProduct(productID) {
    return await persistence.deleteProduct(productID)
}

export async function updateProduct(productID, act) {
    return await persistence.updateProduct(productID, act)
}
