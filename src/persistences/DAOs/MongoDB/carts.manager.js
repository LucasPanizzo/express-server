// Imports
import { cartsModels } from "../../MongoDB/models/carts.models.js";
import { ticketsModels } from "../../MongoDB/models/tickets.models.js";
import { updateProductService, getProductsByIDService } from "../../../services/products.services.js"
import CustomError from "../../../errors/newError.js";
import { ErrorsCause,ErrorsMessage,ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";

export default class cartManager {
    // Trae todos los carts creados con el modelo correspondiente
    async getCarts() {
        try {
            const cartsList = await cartsModels.find({}).lean()
            return cartsList
        } catch{
            logger.error(ErrorsMessage.CART_EMPTYLIST_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_EMPTYLIST_CAUSE,
                message: ErrorsMessage.CART_EMPTYLIST_ERROR
            });
        }
    }
    // Trae un cart en especifico mediante el ID
    async getCartByID(id) {
        try {
            const cart = await cartsModels.findById(id)
            return cart
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Trae el carrito y pasa por el .pre de models para usar populate
    async findCartAndPoblate(id) {
        try {
            const cart = await cartsModels.find({ _id: id }).lean()
            return cart 
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            }); 
        }
    }
    // Crea un cart con el modelo designado
    async addCart() {
        try {
            const newCart = await cartsModels.create({})
            return newCart
        } catch{
            logger.error(ErrorsMessage.CART_ADD_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_ADD_CAUSE,
                message: ErrorsMessage.CART_ADD_ERROR
            });
        }
    }
    // Devuelve un producto especifico dentro de un cart especifico
    async findProductInCart(idCart, idProduct) {
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const productExists = productsArray.find((el) => el.productId.toHexString() === idProduct)
            // Busca el producto existente dentro del array. La verificación de la existencia del producto se hace desde el controller, antes de pasar por el router.
            return productExists
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Agrega un producto al carrito
    async addToCart(idCart, idProduct,owner) {
        try {
            const cart = await this.getCartByID(idCart)
            const productsArray = cart.products
            const product = await this.findProductInCart(idCart, idProduct)
            const isARealProduct = await getProductsByIDService(idProduct)
            if (isARealProduct) {
                if(isARealProduct.owner !== owner.email){
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
                } else{
                    logger.warn(ErrorsMessage.AUTH_INVALIDROL_ERROR);
                    throw CustomError.createCustomError({
                      name: ErrorsName.SESSION_ERROR,
                      cause: ErrorsCause.AUTH_INVALIDROL_CAUSE,
                      message: ErrorsMessage.AUTH_INVALIDROL_ERROR
                    });
                }
            } else{
                logger.warn(ErrorsMessage.CART_WRONGID_ERROR)
                throw CustomError.createCustomError({
                    name: ErrorsName.CART_ERROR,
                    cause: ErrorsCause.CART_WRONGID_CAUSE,
                    message: ErrorsMessage.CART_WRONGID_ERROR
                });
            }
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Elimina un producto de un carrito especificos
    async deleteProduct(idCart, idProduct) {
        try {
            const cart = await this.getCartByID(idCart)
            const productToDeleteIndex = cart.products.findIndex(e => e.productId == idProduct)
            const isARealProduct = await getProductsByIDService(idProduct)
            if (isARealProduct) {
                if (productToDeleteIndex !== -1) {
                    cart.products.splice(productToDeleteIndex, 1);
                    const updatedCart = await cart.save()
                    return updatedCart
                }
                else {
                    return undefined
                }
            } else{
                logger.warn(ErrorsMessage.CART_WRONGID_ERROR)
                throw CustomError.createCustomError({
                    name: ErrorsName.CART_ERROR,
                    cause: ErrorsCause.CART_WRONGID_CAUSE,
                    message: ErrorsMessage.CART_WRONGID_ERROR
                }); 
            }
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Cambia la propiedad quantity de un producto especifico
    async modifyProductQuantity(idCart, idProduct, quantity) {
        try {
            if (quantity > 0) {
                const filter = { _id: idCart, "products.productId": idProduct };
                const update = { $set: { "products.$.quantity": quantity } }
                const updatedCartProduct = await cartsModels.findOneAndUpdate(filter, update, { new: true });
                return updatedCartProduct
            } else {
                logger.warn(ErrorsMessage.CART_WRONGQUANTITY_ERROR)
                throw CustomError.createCustomError({
                    name: ErrorsName.CART_ERROR,
                    cause: ErrorsCause.CART_WRONGQUANTITY_CAUSE,
                    message: ErrorsMessage.CART_WRONGQUANTITY_ERROR
                }); 
            }
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Elimina todos los productos dentro del cart
    async emptyCart(idCart) {
        try {
            const cart = await this.getCartByID(idCart)
            cart.products = []
            await cart.save()
            return cart
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Reemplaza los productos existentes de un cart, por los que le lleguen de propiedad en forma de array
    async updateProductsInCart(products, idCart) {
        try {
            if (products.length != 0) {
                const cart = await this.getCartByID(idCart)
                await this.emptyCart(idCart)
                products.forEach(element => {
                    cart.products.push(element)
                });
                await cart.save()
                return cart
            } else {
                logger.warn(ErrorsMessage.CART_EMPTYFIELD_ERROR)
                throw CustomError.createCustomError({
                    name: ErrorsName.CART_ERROR,
                    cause: ErrorsCause.CART_EMPTYFIELD_CAUSE,
                    message: ErrorsMessage.CART_EMPTYFIELD_ERROR
                });
            }
        } catch{
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
    }
    // Funcion para finalizar compra
    async purchaseProductsInCart(idCart, email) {
        try {
          const cart = await this.getCartByID(idCart);
          console.log(cart,email);
          const productsInCart = cart.products;
          let prices = [];
          let productsNoStock = [];
          let productsStocked = [];
          // Ciclo for, se reproduce segun la cantidad de productos que haya en el cart
          for (let i = 0; i < productsInCart.length; i++) {
            // Recupera el producto
            const product = await getProductsByIDService(
              productsInCart[i].productId.toHexString()
            );
            // Checkea el stock, si el producto tiene stock; se suma el precio del producto al precio total de la compra, se modifica el stock del producto en la base de datos, se agrega al producto a un array para poder recuperarlos luego y se elimina del carrito para finalizar la compra.
            if (product.stock >= productsInCart[i].quantity) {
              let subTotal = product.price * productsInCart[i].quantity;
              prices.push(subTotal);
              const newStock = product.stock - productsInCart[i].quantity;
              productsStocked.push(productsInCart[i])
              await this.deleteProduct(idCart, productsInCart[i].productId.toHexString());
              await updateProductService(productsInCart[i].productId.toHexString(), {
                stock: newStock,
              });
            } else {
              // Si el producto no tiene stock, solo se agrega a un array para ser recuperado más tarde por otras funciones.
              productsNoStock.push(productsInCart[i].productId.toHexString());
            }
          }
         // Checkeo si existe algún producto con stock, para no envíar tickets vacios a la DB.
         if(productsStocked.length != 0){
            await this.#ticketGenerator(prices, email);}
         return {productsNoStock,productsStocked}
        } catch(error){
            console.log(error);
            logger.error(ErrorsMessage.CART_WRONGID_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.CART_ERROR,
                cause: ErrorsCause.CART_WRONGID_CAUSE,
                message: ErrorsMessage.CART_WRONGID_ERROR
            });
        }
      }
    // Envia tickets con los datos de la compra a la DB
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
    // Genera automaticamente un código para cada ticket
    async #codeGenerator() {
        try {
            const ticketsList = await ticketsModels.find({})
            let code = 1
            if (ticketsList.length !== 0) {
                code = parseInt(ticketsList[ticketsList.length - 1].code) + 1
            }
            return code
        } catch{
            logger.error('Code generation error')
        }
    }    
}

