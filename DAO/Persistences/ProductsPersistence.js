import FileManager from '../FyleSystem/controllers/products.controllers.js'
import MongoDB from '../MongoDB/db/controllers/products.controllers.js'
import { productsModels } from '../MongoDB/db/models/products.models.js'
import { Command } from 'commander'

const program = new Command();
program.option('-p', 'persistence', 'memory');
program.parse();

let persistence

let argv = program.args[0]

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
