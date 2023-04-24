import { cartsModels } from "../../MongoDB/models/carts.models.js";
import { ticketsModels } from "../../MongoDB/models/tickets.models.js";
import { updateProductService, getProductsByIDService } from "../../../services/products.services.js"

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
            console.log(error);
        }
    }
    async findCartAndPoblate(id) {
        try {
            const cart = await cartsModels.find({ _id: id }).lean()
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
    async findProductInCart(idCart, idProduct) {
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const productExists = productsArray.find((el) => el.productId.toHexString() === idProduct)
            return productExists
        } catch (error) {
            console.log(error);
        }
    }
    async addToCart(idCart, idProduct) {
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const product = await this.findProductInCart(idCart, idProduct)
            if (product) {
                const newQuantity = product.quantity + 1
                const actCart = await this.modifyProductQuantity(idCart, idProduct, newQuantity)
                return actCart
            } else {
                const product = {
                    quantity: 1,
                    productId: idProduct
                }
                productsArray.push(product)
                await cart.save()
                return cart
            }
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProduct(idCart, idProduct) {
        try {
            const cart = await this.getCartByID(idCart)
            const productToDeleteIndex = cart.products.findIndex(e => e.productId == idProduct)
            if (productToDeleteIndex !== -1) {
                cart.products.splice(productToDeleteIndex, 1);
                const updatedCart = await cart.save()
                return updatedCart
            }
            else {
                return undefined
            }
        } catch (error) {
            console.log(error);
        }
    }
    async modifyProductQuantity(idCart, idProduct, quantity) {
        try {
            const filter = { _id: idCart, "products.productId": idProduct };
            const update = { $set: { "products.$.quantity": quantity } }
            const updatedCartProduct = await cartsModels.findOneAndUpdate(filter, update, { new: true });
            return updatedCartProduct
        } catch (error) {
            console.log(error)
        }
    }
    async emptyCart(idCart) {
        try {
            const cart = await this.getCartByID(idCart)
            cart.products = []
            await cart.save()
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    async updateProductsInCart(products, idCart) {
        try {
            console.log(products,idCart);
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
    async purchaseProductsInCart(idCart, email) {
        try {
          const cart = await this.getCartByID(idCart);
          const productsInCart = cart.products;
          let prices = [];
          let productsNoStock = [];
      
          for (let i = 0; i < productsInCart.length; i++) {
            const product = await getProductsByIDService(
              productsInCart[i].productId.toHexString()
            );
      
            if (product.stock >= productsInCart[i].quantity) {
              let subTotal = product.price * productsInCart[i].quantity;
              prices.push(subTotal);
              const newStock = product.stock - productsInCart[i].quantity;
              await this.deleteProduct(idCart, productsInCart[i].productId.toHexString());
              await updateProductService(productsInCart[i].productId.toHexString(), {
                stock: newStock,
              });
            } else {
              productsNoStock.push(productsInCart[i]);
              console.log(productsNoStock);
            }
          }
         return await this.#ticketGenerator(prices, email);

        } catch (error) {
          console.log(error);
        }
      }
    async #ticketGenerator(prices, email) {
        const totalPrice = prices.reduce((acc, el) => acc + el, 0)
        const code = await this.#codeGenerator()
        const ticket = {
            code: code,
            purchase_datetime: new Date(),
            amount: totalPrice,
            purchaser: email
        }
        const newTicket = await ticketsModels.create(ticket)
        return newTicket
    }
    async #codeGenerator() {
        try {
            const ticketsList = await ticketsModels.find({})
            let code = 1
            if (ticketsList.length !== 0) {
                code = parseInt(ticketsList[ticketsList.length - 1].code) + 1
            }
            return code
        } catch (error) {
            console.log(error)
        }
    }
    // async purchaseProductsInCart(idCart, email) {
    //     try {
    //         const cart = await this.getCartByID(idCart)
    //         const productsInCart = cart.products
    //         let prices = []
    //         let productsNoStock = []
    //         const promises = productsInCart.map(async e => {
    //             const product = await getProductsByIDService(e.productId.toHexString())
    //             if (product.stock >= e.quantity) {
    //                 let subTotal = product.price * e.quantity
    //                 prices.push(subTotal)
    //                 const newStock = product.stock - e.quantity
    //                 await updateProductService(e.productId.toHexString(), { stock: newStock })
    //                 return {
    //                     productId: e.productId.toHexString(),
    //                     quantity: e.quantity
    //                 }
    //             } else {
    //                 productsNoStock.push(e.productId.toHexString())
    //                 return null
    //             }
    //         })
    //         const productsBought = (await Promise.all(promises)).filter(e => e)
    //         if (productsBought.length > 0) {
    //             await this.deleteProducts(idCart, productsBought)
    //             await this.#ticketGenerator(prices, email)
    //         }
    //         if (productsNoStock.length > 0) {
    //             await this.updateCartProducts(idCart, productsNoStock)
    //             return productsNoStock
    //         }
    //         return []
    //     } catch (error) {
    //         console.log(error);
    //         return []
    //     }
    // }
    // async purchaseProductsInCart(idCart, email) {
    //     try {
    //         const cart = await this.getCartByID(idCart)
    //         const productsInCart = cart.products
    //         let prices = []
    //         let productsNoStock = []
    //         productsInCart.forEach(async e => {
    //             const product = await getProductsByIDService(e.productId.toHexString())
    //             if (product.stock > e.quantity) {
    //                 let subTotal = product.price * e.quantity
    //                 prices.push(subTotal)
    //                 const newStock = product.stock - e.quantity
    //                 await this.deleteProduct(idCart, e.productId.toHexString())
    //                 await updateProductService(e.productId.toHexString(), { stock: newStock })
    //                 await this.#ticketGenerator(prices,email)
    //             } else {
    //                 this.updateProductsInCart(productsNoStock, idCart)
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
      
}

