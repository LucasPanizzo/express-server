import { cartsModels } from "../models/carts.models.js";

export default class cartManager {

    async getCarts() {
        try {
            const cartsList = await cartsModels.find({}).lean()
            return cartsList
        } catch (error) {
            console.log(error);
        }
    }
    async getCartByID(id){
        try {
            const cart = await cartsModels.findById(id)
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    async findCartAndPoblate(id) {
        try {
            const cart = await cartsModels.find({_id:id})
            return cart
        } catch (error) {
            console.log(error)
        }
    }
    async addCart() {
        try {
            const newCart = await cartsModels.create({})
            return newCart
        } catch (error) {
            console.log(error);
        }
    }
    async findProductInCart(idCart,idProduct){
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const productExists = productsArray.find((el) => el._id.toHexString() === idProduct)
            return productExists
        } catch (error) {
            console.log(error);
        }
    }
    async addToCart(idCart,idProduct){
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const product = await this.findProductInCart(idCart,idProduct)
            if (product) {
                const newQuantity = product.quantity + 1
                const actCart = await this.modifyProductQuantity(idCart,idProduct,newQuantity)
                return actCart
            } else {
                productsArray.push(idProduct)
                await cart.save()
                return cart
            }
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProduct(idCart,idProduct){
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const deletedProduct = await this.findProductInCart(idCart,idProduct)
            const productIndex = productsArray.indexOf(deletedProduct)
            productsArray.splice(productIndex,1)
            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    async modifyProductQuantity(idCart,idProduct,quantity){
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const modifiedProduct = await this.findProductInCart(idCart,idProduct)
            await this.deleteProduct(idCart,modifiedProduct._id)
            const newQuantity = {
                "quantity": quantity,
                "_id":idProduct
            }
            productsArray.push(newQuantity)
            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    async emptyCart(idCart){
        try {
            const cart = await this.getCartByID(idCart)
            cart.products = []
            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }    
    async updateProductsInCart(products,idCart){
        try {
            const cart = await this.getCartByID(idCart)
            await this.emptyCart(idCart)
            products.forEach(element => {
                cart.products.push(element)
            });
            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }
}