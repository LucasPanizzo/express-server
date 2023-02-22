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
    async getCartByID(id) {
        try {
            const cart = await cartsModels.findById(id)
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
            const cart = await this.getCartByID(idCart)
            const arrayProds = cart.products
            const exists = await arrayProds.find((el) => el.idProduct === idProduct)
            console.log(exists);
            if (exists) {
                const add = exists.quantity + 1
                const act = { "quantity": add }
                const objAct = { ...exists, ...act }
                arrayProds.splice(arrayProds.indexOf(exists), 1)
                arrayProds.push(objAct)
                const added = await cartsModels.updateOne({_id:idCart},{products:arrayProds})
                return added
            } else {
                const quantity = 1
                const prodArray = { idProduct, quantity }
                arrayProds.push(prodArray)
                const added = await cartsModels.updateOne({_id:idCart},{products:arrayProds})
                return added
            }
        } catch (error) {
            console.log(error)
        }
    }

}