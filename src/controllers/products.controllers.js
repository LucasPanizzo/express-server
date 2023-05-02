import { getProductsService, getProductsByIDService, addProductService, deleteProductService, updateProductService, addMockingProductsService, getMockingProductsService } from "../services/products.services.js";
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";

export const getProductsController = async (req, res) => {
    try {
        const { limit, page, sort, ...query } = req.query
        const products = await getProductsService(limit, page, sort, query)
        res.send(products)
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
            message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
        });
    }
}

export const getProductsByIDController = async (req, res) => {
    try {
        const { idProduct } = req.params
        const searchedProduct = await getProductsByIDService(idProduct)
        res.json({ message: 'Producto encontrado', searchedProduct })
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
            message: ErrorsMessage.PRODUCT_WRONGID_ERROR
        });
    }
}

export const addProductController = async (req, res) => {
    try {
        await addProductService(req.body)
        res.send('Producto creado con exito.')
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_ADD_CAUSE,
            message: ErrorsCause.PRODUCT_ADD2_CAUSE
        });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const { idProduct } = req.params
        await deleteProductService(idProduct)
        res.send('Producto eliminado con exito')
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
            message: ErrorsMessage.PRODUCT_WRONGID_ERROR
        });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { idProduct } = req.params
        const actualizacion = req.body
        const clavesPermitidas = ['title', 'description', 'price', 'code', 'stock', 'status', 'category', 'thumbnails'];
        const actualizacionValida = Object.keys(actualizacion).some((clave) => clavesPermitidas.includes(clave));
        if (actualizacionValida != false) {
            await updateProductService(idProduct, actualizacion)
            res.send('Producto modificado con exito')
        } else {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                message: ErrorsMessage.PRODUCT_ADD_ERROR
            });
        }
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
            message: ErrorsMessage.PRODUCT_WRONGID_ERROR
        });
    }
}

export const writeProductsController = async (req, res) => {
    try {
        const { limit, page, sort, ...query } = req.query
        const products = await getProductsService(limit, page, sort, query)
        const productsList = await products.payload.map(product => Object.assign({}, product._doc))
        res.render('index', { "session": req.session.userInfo, "products": productsList })
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
            message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
        });
    }
}

export const mockingProductsController = async (req, res) => {
    try {
        const mockingList = await getMockingProductsService()
        if (mockingList.length === 0) {
            const newMockigns = await addMockingProductsService()
            res.send(`Se han generado ${await newMockigns.length} productos mediante mockings.`)
        } else {
            res.send(mockingList)
        }
    } catch {
        CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_ADD_CAUSE,
            message: ErrorsMessage.PRODUCT_ADD_ERROR
        });
    }
}