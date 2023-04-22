
import FileManager from '../DAOs/FyleSystem/carts.manager.js'
import MongoDB from '../DAOs/MongoDB/carts.manager.js'
import { cartsModels } from '../MongoDB/models/carts.models.js'
import config from '../../config.js'

let persistence

let argv = config.PERSISTENCES[0]

switch (argv){
    case 'fs':
        persistence = new FileManager('../FyleSystem/database/carts.json')
        break;
    case 'mongo':
        persistence = new MongoDB('carts', cartsModels)
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