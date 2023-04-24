import { addCart,getCartByID,getCarts,addToCart,deleteProduct,emptyCart,modifyProductQuantity,updateProductsInCart,purchase } from "../persistences/persistences/cartsPersistence.js";

export async function addCartService(){
    const cart = await addCart()
    return cart
}

export async function getCartsService(){
    const carts = await getCarts()
    return carts
}

export async function getCartByIDService(cartID){
    const cart = await getCartByID(cartID)
    return cart
}

export async function addToCartService(cartID, productID){
    const editedCart = await addToCart(cartID, productID)
    return editedCart
}

export async function deleteProductService(cartID, productID){
    const cart = await deleteProduct(cartID, productID)
    return cart
}

export async function emptyCartService(cartID){
    const cart = await emptyCart(cartID)
    return cart
}

export async function modifyProductQuantityService(cartID, productID, quantity){
    const cart = await modifyProductQuantity(cartID, productID, quantity)
    return cart
}

export async function updateProductsInCartService(products, cartID){
    const cart = await updateProductsInCart(products, cartID)
    return cart
}

export async function purchaseService(cartID,email){
    const ticket = await purchase(cartID,email)
    return ticket
}