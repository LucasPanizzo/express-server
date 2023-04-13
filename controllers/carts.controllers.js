import { addCartService,getCartsService,getCartByIDService,addToCartService,deleteProductService,emptyCartService,updateProductsInCartService,modifyProductQuantityService } from "../services/carts.services.js";
import {getProductsByIDService} from '../services/products.services.js'


export const addCartController = async (req, res) => {
    try {
        await addCartService()
        res.send('carrito creado con exito')
    } catch (error) {
        console.log('aca',error);
    }
}

export const getCartController = async (req, res) => {
    try {
        const carts = await getCartsService()
        res.json({ message:'Lista de carritos:',carts})
    } catch (error) {
        console.log(error);
    }
}

export const getCartByIDController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const cartProducts = searchedCart[0].products
            res.json({message:'Carrito encontrado',cartProducts})
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const addToCartController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await addToCartService(cartID,productID)
                res.send('Producto agregado con exito.')
            } else {
                res.send('El producto que quieres agregar no existe')
            }
        } else {
            res.send('El carrito buscado no existe')
        }
    } catch (error) {
        console.log('error');
    }
}

export const deleteProductController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await deleteProductService(cartID,productID)
                res.send('Producto eliminado con exito.')
            } else {
                res.send('El producto que quieres eliminar no se encuentra en el carrito.')
            }
        } else {
            res.send('El carrito buscado no existe')
        }
    } catch (error) {
        console.log('error');
    }
}

export const emptyCartController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            await emptyCartService(cartID)
            res.send('Carrito vaciado con exito.')
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const updateProductsInCartController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const products = req.body
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            await updateProductsInCartService(products,cartID)
            res.send('Carrito modificado con exito.')
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const modifyProductQuantityController =  async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const quantity = parseInt(req.body)
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await modifyProductQuantityService(cartID,productID,quantity)
                res.send('Cantidad modificada con exito.')
            } else {
                res.send('El producto que quieres modificar no se encuentra en el carrito.')
            }
        } else {
            res.send('El carrito buscado no existe')
        }
    } catch (error) {
        console.log('error');
    }
}