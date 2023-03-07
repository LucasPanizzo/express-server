import { cartsModels } from "../models/carts.models.js";
import mongoose from "mongoose";

export default class cartManager {

    async getCarts() {
        try {
            const cartsList = await cartsModels.find({}).lean()
            return cartsList
        } catch (error) {
            console.log(error);
        }
    }
    async getCartByID(id) {
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
    async addToCart(idCart, idProduct) {
        try {
            const cart = await cartsModels.findById(idCart)
            const arrayProds = cart.products
            const exists = this.findProductInCart(idCart,idProduct)
            if (exists) {
                exists.quantity ++
                cart.save()
                return cart
            } else {
                arrayProds.push(idProduct)
                cart.save()
                return cart
             }
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(idCart,idProduct){
        try {
            const cart = await cartsModels.findById(idCart)
            const arrayProds = cart.products
            const productoBorrado = arrayProds.find((el) => el._id.toHexString() === idProduct)
            const index = arrayProds.indexOf(productoBorrado)
            arrayProds.splice(index,1)
            cart.save()
        } catch (error) {
            console.log(error)
        }
    }
    async modifyQuantity(idCart,idProduct,quantity){
        try {
            const cart = await cartsModels.findById(idCart)
            const arrayProds = cart.products
            const productoModificado = arrayProds.find((el) => el._id.toHexString() === idProduct)
            productoModificado.quantity = quantity
            cart.save()
            return cart
        } catch (error) {
            console.log(error)
        }
    }
    async emptyCart(idCart){
        const cart = await cartsModels.findById(idCart)
        cart.products = []
        cart.save()
        return cart
    }
    async findProductInCart(idCart,idProduct){
        const cart = await cartsModels.findById(idCart)
        const arrayProds = cart.products
        const exists = arrayProds.find((el) => el._id.toHexString() === idProduct)
        return exists
    }
    async updateProductsIncart(productos,idCart){
        const updatedCart = await cartsModels.findById(idCart)
        this.emptyCart(idCart)
        productos.forEach(element => {
            updatedCart.products.push(element)
        });
        updatedCart.save()
        return updatedCart
    }
}