import FileManager from '../FyleSystem/controllers/carts.controllers.js'
import MongoDB from '../MongoDB/db/controllers/carts.controllers.js'
import { cartsModels } from '../MongoDB/db/models/carts.models.js'
import { Command } from 'commander'

const program = new Command();
program.option('-p', 'persistence', 'memory');
program.parse();

let persistence

let argv = program.args[0]

switch (argv){
    case 'fs':
        persistence = new FileManager('../FyleSystem/database/carts.json')
        break;
    case 'mongo':
        persistence = new MongoDB('Carts', cartsModels)
        break;
    default:
        break;
}

export async function addCart() {
    return await persistence.addCart()
}

export async function getCarts() {
    return await persistence.getCarts()
}

export async function getCartByID(cartID) {
    return await persistence.findCartAndPoblate(cartID)
}

export async function addToCart(cartID, productID) {
    return await persistence.addToCart(cartID, productID)
}

export async function deleteProduct(cartID, productID) {
    return await persistence.deleteProduct(cartID, productID)
}

export async function emptyCart(cartID) {
    return await persistence.emptyCart(cartID)
}

export async function modifyProductQuantity(cartID, productID, quantity) {
    return await persistence.modifyProductQuantity(cartID, productID, quantity)
}

export async function updateProductsInCart(products, cartID) {
    return await persistence.updateProductsInCart(products, cartID)
}