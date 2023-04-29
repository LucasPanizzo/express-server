import { addCartService, getCartsService, getCartByIDService, addToCartService, deleteProductService, emptyCartService, updateProductsInCartService, modifyProductQuantityService, purchaseService } from "../services/carts.services.js"
import { getProductsByIDService } from '../services/products.services.js'
import { currentSessionService } from "../services/users.services.js"


export const addCartController = async (req, res) => {
    try {
        await addCartService()
        res.send('carrito creado con exito')
    } catch (error) {
        console.log(error);
    }
}

export const getCartsController = async (req, res) => {
    try {
        const carts = await getCartsService()
        res.json({ message: 'Lista de carritos:', carts })
    } catch (error) {
        console.log(error);
    }
}

export const getCartByIDController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const cartProducts = searchedCart[0].products
            res.json({ message: 'Carrito encontrado', cartProducts })
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const getUserCart = async (req, res) => {
    try {
        const cartID = req.session.userInfo.userCart
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const cartProducts = searchedCart[0]
            res.json({ message: 'Carrito encontrado', cartProducts })
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const addToCartController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await addToCartService(cartID, productID)
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

export const deleteProductController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await deleteProductService(cartID, productID)
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

export const emptyCartController = async (req, res) => {
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

export const updateProductsInCartController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const products = req.body
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            await updateProductsInCartService(products, cartID)
            res.send('Carrito modificado con exito.')
        } else {
            res.send('El carrito buscado no existe en la base de datos.')
        }
    } catch (error) {
        console.log('error');
    }
}

export const modifyProductQuantityController = async (req, res) => {
    try {
        const cartID = req.params.cid
        const productID = req.params.pid
        const quantity = parseInt(req.body)
        const searchedCart = await getCartByIDService(cartID)
        if (searchedCart) {
            const productFound = await getProductsByIDService(productID)
            if (productFound) {
                await modifyProductQuantityService(cartID, productID, quantity)
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

export const purchaseController = async (req, res) => {
    try {
        const currentSession = await currentSessionService(await req.session.userInfo)
        const email = currentSession.email
        const cartID = req.params.cid
        const response = await purchaseService(cartID, email)
        const remainingProducts = response.productsNoStock
        if (remainingProducts.length != 0) {
        res.json({message:`Los siguientes productos no tienen stock suficiente para ser comprados: ${remainingProducts}`})
        } else {
            res.json({message:`Compra realiza con éxito`})
        }
    } catch (error) {
        console.log(error);
    }
}

export const writeCartsController = async (req,res)=>{
    const session = await currentSessionService(await req.session.userInfo)
    const userCartID = session.userCart
    const cart = await getCartByIDService(userCartID)
    const products = cart[0].products
    res.render('cart',{"products":products})
}