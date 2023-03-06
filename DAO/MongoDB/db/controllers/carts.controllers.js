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
            const exists = cart.products.find((el) => el._id.toHexString() === idProduct)
            if (exists) {
                // logica que modifica la cantidad.
            } else {
                arrayProds.push(idProduct)
                cart.save()
                return cart
             }
        } catch (error) {
            console.log(error)
        }
    }

}