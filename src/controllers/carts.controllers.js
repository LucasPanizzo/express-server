import { addCartService, getCartsService, getCartByIDService, addToCartService, deleteProductService, emptyCartService, updateProductsInCartService, modifyProductQuantityService, purchaseService } from "../services/carts.services.js"
import { currentSessionService } from "../services/users.services.js"
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";

export const addCartController = async (req, res) => {
    try {
        await addCartService()
        res.send('carrito creado con exito')
    } catch {
        logger.error(ErrorsMessage.CART_ADDCARTFAIL_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_ADDCARTFAIL_CAUSE,
            message: ErrorsMessage.CART_ADDCARTFAIL_ERROR
        });
    }
}

export const getCartsController = async (req, res) => {
    try {
        const carts = await getCartsService()
        res.json({ message: 'Lista de carritos:', carts })
    } catch {
        logger.error(ErrorsMessage.CART_EMPTYLIST_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_EMPTYLIST_CAUSE,
            message: ErrorsMessage.CART_EMPTYLIST_ERROR
        });
    }
}

export const getCartByIDController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const searchedCart = await getCartByIDService(cartID)
        const cartProducts = searchedCart[0].products
        res.json({ message: 'Carrito encontrado', cartProducts })
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        });
    }
}

export const getUserCart = async (req, res) => {
    try {
        const cartID = req.session.userInfo.userCart
        const searchedCart = await getCartByIDService(cartID)
        const cartProducts = searchedCart[0]
        res.json({ message: 'Carrito encontrado', cartProducts })
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        });
    }
}

export const addToCartController = async (req, res) => {
    try {
        const owner = await currentSessionService(await req.session.userInfo)
        const cartID = req.params.cid
        const productID = req.params.pid
        await addToCartService(cartID, productID,owner)
        res.send('Producto agregado con exito.')
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        await deleteProductService(cartID, productID)
        res.send('Producto eliminado con exito.')
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        });
    }
}

export const emptyCartController = async (req, res) => {
    try {
        const cartID = req.params.cid
        await emptyCartService(cartID)
        res.send('Carrito vaciado con exito.')
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        });
    }
}

export const updateProductsInCartController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const products = req.body
        await updateProductsInCartService(products, cartID)
        res.send('Carrito modificado con exito.')
    } catch {
        logger.error(ErrorsMessage.CART_EMPTYFIELD_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_EMPTYFIELD_CAUSE,
            message: ErrorsMessage.CART_EMPTYFIELD_ERROR
        });
    }
}

export const modifyProductQuantityController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const quantity = parseInt(req.body)
        await modifyProductQuantityService(cartID, productID, quantity)
        res.send('Cantidad modificada con exito.')
    } catch {
        logger.error(ErrorsMessage.CART_WRONGQUANTITY_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGQUANTITY_CAUSE,
            message: ErrorsMessage.CART_WRONGQUANTITY_ERROR
        });
    }
}

export const purchaseController = async (req, res) => {
    try {
        const currentSession = await currentSessionService(await req.session.userInfo)
        const email = currentSession.email
        const cartID = req.params.cid
        const response = await purchaseService(cartID, email)
        const remainingProducts = response.productsNoStock
        if (remainingProducts.length != 0) {
            res.json({ message: `Los siguientes productos no tienen stock suficiente para ser comprados: ${remainingProducts}` })
        } else {
            res.json({ message: `Compra realiza con éxito` })
        }
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        }); 
    }
}

export const writeCartsController = async (req, res) => {
    try {
        const session = await currentSessionService(await req.session.userInfo)
        const userCartID = session.userCart
        const cart = await getCartByIDService(userCartID)
        const products = cart[0].products
        res.render('cart', { "products": products })
    } catch {
        logger.error(ErrorsMessage.CART_WRONGID_ERROR)
        CustomError.createCustomError({
            name: ErrorsName.CART_ERROR,
            cause: ErrorsCause.CART_WRONGID_CAUSE,
            message: ErrorsMessage.CART_WRONGID_ERROR
        }); 
    }
}