import { productsModels } from "../models/products.models.js"
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
        } catch (error) {
            const productsInfo = {
                status : "error",
                error : error
            }
            return productsInfo
        }
    }
    async addProduct(obj) {
        try {
            const newProduct = new productsModels(obj)
            const productSaved = newProduct.save()
            return productSaved
        } catch (error) {
            console.log(error);
        }
    }
    async getProductsByID(id) {
        try {
            const product = await productsModels.findById(id)
            return product
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(id){
        try {
            const deletedProd = await productsModels.deleteOne({_id:id})
            return deletedProd
        } catch (error) {
            console.log(error)
        }
    }
    async updateProduct(id,actualizacion){
        try {
            const updateProduct = await productsModels.findOneAndUpdate({_id:id},{...actualizacion})
            return updateProduct
        } catch (error) {
            console.log(error)
        }
    }
}


