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
            const cart = await cartsModels.find({_id:id}).lean()
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
            const productExists = productsArray.find((el) => el.productId.toHexString() === idProduct)
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
                const product = {
                    quantity:1,
                    productId:idProduct
                }
                productsArray.push(product)
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
            const productToDeleteIndex = cart.products.findIndex(e => e.productId == idProduct)
                
                if (productToDeleteIndex !== -1) {
                    cart.products.splice(productToDeleteIndex,1);
                    const updatedCart = await cart.save()
                    return updatedCart
                }
                else{
                    return undefined
                }
        //     const cart = await this.getCartByID(idCart)
        //     const productsArray = cart.products
        //     const deletedProduct = await this.findProductInCart(idCart,idProduct)
        //     const productIndex = productsArray.indexOf(deletedProduct)
        //     productsArray.splice(productIndex,1)
        //     console.log(productIndex);
        //     await cart.save()
        //     return cart
        } catch (error) {
            console.log(error);
        }
    }
    async modifyProductQuantity(cid,pid,quantity){
        try {
            const filter = {_id:cid, "products.productId":pid};
            const update = { $set: {"products.$.quantity": quantity}}
            const updatedCartProduct = await cartsModels.findOneAndUpdate(filter,update,{new:true});
            return updatedCartProduct
        } catch (error) {
            console.log(error)
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