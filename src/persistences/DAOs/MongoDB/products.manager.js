import { productsModels } from "../../MongoDB/models/products.models.js"
import { generateProducts } from "../../../public/js/mockings.js"
import { mockingsModels } from "../../MongoDB/models/mockings.models.js"
import CustomError from "../../../errors/newError.js";
import { ErrorsCause,ErrorsMessage,ErrorsName } from "../../../errors/errorMessages.js";
export default class ProductManager {
    async getProducts(limit,page,sort,query) {
        try {
            const objects = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: parseInt(sort) ? {price:sort} : {},
            }
            const queryes = query || {}
            const products = await productsModels.paginate(queryes,objects)
            const productsInfo= {
                status:"success",
                payload: products.docs,
                info:{totalpages:products.totalPages,
                    prevPage:products.prevPage,
                    nextPage:products.nextPage,
                    page:products.page,
                    hasPrevPage:products.hasPrevPage,
                    hasNextPage:products.hasNextPage,
                    prevLink:products.hasPrevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}` : null,
                    nextLink:products.hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}` : null}
            }
            return productsInfo
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
                message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
            });
        }
    }
    async addProduct(obj) {
        try {
            const products = await getProductsService()
            const productsList = products.payload
            if (productsList.find((el) => el.code === req.body.code)) {
                CustomError.createCustomError({
                    name: ErrorsName.PRODUCT_ERROR,
                    cause: ErrorsCause.PRODUCT_REPEATEDCODE_CAUSE,
                    message: ErrorsMessage.PRODUCT_REPEATEDCODE_ERROR
                });
            } else {
                if (obj.title || obj.description || obj.code || obj.price || obj.stock || obj.status || obj.category || obj.thumbnails){
                    const newProduct = new productsModels(obj)
                    const productSaved = newProduct.save()
                    return productSaved  
                } else{
                    CustomError.createCustomError({
                        name: ErrorsName.PRODUCT_ERROR,
                        cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                        message: ErrorsMessage.PRODUCT_ADD_ERROR
                    });
                }
            }
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                message: ErrorsMessage.PRODUCT_ADD_ERROR
            });
        }
    }
    async getProductsByID(id) {
        try {
            const product = await productsModels.findById(id)
            return product
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
                message: ErrorsMessage.PRODUCT_WRONGID_ERROR
            });
        }
    }
    async deleteProduct(id){
        try {
            const deletedProd = await productsModels.deleteOne({_id:id})
            return deletedProd
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
                message: ErrorsMessage.PRODUCT_WRONGID_ERROR
            });
        }
    }
    async updateProduct(id,actualizacion){
        try {
            const clavesPermitidas = ['title', 'description', 'price', 'code', 'stock', 'status', 'category', 'thumbnails'];
            const actualizacionValida = Object.keys(actualizacion).some((clave) => clavesPermitidas.includes(clave));
            if (actualizacionValida != false) {
                const updateProduct = await productsModels.findOneAndUpdate({_id:id},{...actualizacion})
                return updateProduct  
            } else{
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
    async addMockingProducts(){
        try {
            const productList = generateProducts()
            const mockingProducts = await mockingsModels.create(productList)
            return mockingProducts
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                message: ErrorsMessage.PRODUCT_ADD_ERROR
            });
        }
    }
    async getMockingProducts(){
        try {
            const productList = await mockingsModels.find({})
            return productList
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
                message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
            });
        }
    }
    async deleteMockingProducts(){
        try {
            const productList = await mockingsModels.deleteMany({})
            return productList
        } catch {
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
                message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
            });
        }
    }
}


