
import FileManager from '../DAOs/FyleSystem/products.manager.js'
import MongoDB from '../DAOs/MongoDB/products.manager.js'
import { productsModels } from '../MongoDB/models/products.models.js'
import config from '../../config.js'

let persistence

let argv = config.PERSISTENCES[0]

switch (argv){
    case 'fs':
        persistence = new FileManager('../FyleSystem/database/carts.json')
        break;
    case 'mongo':
        persistence = new MongoDB('products', productsModels)
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

export async function addMockingProducts(){
    return await persistence.addMockingProducts()
}

export async function getMockingProducts(){
    return await persistence.getMockingProducts()
}
