import { getProductsService, getProductsByIDService, addProductService, deleteProductService, updateProductService, addMockingProductsService, getMockingProductsService } from "../services/products.services.js";
import CustomError from "../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../errors/errorMessages.js";
import logger from "../winston.js";
import { currentSessionService } from "../services/users.services.js";

export const getProductsController = async (req, res) => {
    try {
        const { limit, page, sort, ...query } = req.query
        const products = await getProductsService(limit, page, sort, query)
        res.send(products)
    } catch {
        logger.error(ErrorsMessage.PRODUCT_EMPTYLIST_ERROR)
        throw CustomError.createCustomError({
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
        logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
            message: ErrorsMessage.PRODUCT_WRONGID_ERROR
        });
    }
}

export const addProductController = async (req, res) => {
    try {
        const owner = await currentSessionService(await req.session.userInfo)
        const newProduct = await addProductService(req.body,owner)
        res.json({message:'Producto creado con exito.',newProduct})
    } catch {
        logger.error(ErrorsCause.PRODUCT_ADD2_CAUSE)
        throw CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_ADD_CAUSE,
            message: ErrorsCause.PRODUCT_ADD2_CAUSE
        });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const owner = await currentSessionService(await req.session.userInfo)
        const { idProduct } = req.params
        const deletedProduct = await deleteProductService(idProduct,owner)
        res.json({message:'Producto eliminado con exito.',deletedProduct})
    } catch {
        logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
        throw CustomError.createCustomError({
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
            const updatedProduct = await updateProductService(idProduct, actualizacion)
            res.json({message:'Producto modificado con exito.',updatedProduct})
        } else {
            logger.warn();(ErrorsMessage.PRODUCT_ADD_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                message: ErrorsMessage.PRODUCT_ADD_ERROR
            });
        }
    } catch{
        logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
        throw CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
            message: ErrorsMessage.PRODUCT_WRONGID_ERROR
        });
    }
}

export const writeProductsController = async (req, res) => {
    try {
        const user = await currentSessionService(await req.session.userInfo)
        const { limit, page, sort, ...query } = req.query
        const products = await getProductsService(limit, page, sort, query)
        function createArray(end) {
            const result = [];
            for (let i = 1; i <= end; i++) {
                result.push(i);
            }
            return result;
        }
        const totalPages = createArray(products.info.totalpages)
        const productsList = await products.payload.map(product => Object.assign({}, product._doc))
        res.render('index', { "session": req.session.userInfo, "products": productsList,"pages":totalPages })
    } catch {
        logger.error(ErrorsMessage.PRODUCT_EMPTYLIST_ERROR)
        throw CustomError.createCustomError({
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
        throw CustomError.createCustomError({
            name: ErrorsName.PRODUCT_ERROR,
            cause: ErrorsCause.PRODUCT_ADD_CAUSE,
            message: ErrorsMessage.PRODUCT_ADD_ERROR
        });
    }
}