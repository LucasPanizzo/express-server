import { productsModels } from "../models/products.models.js"
export default class ProductManager {

    async getProducts() {
        try {
            const products = await productsModels.find({}).lean()
            return products
        } catch (error) {
            console.log(error);
        }
    }
    async addProduct(obj) {
        try {
            const newProduct = await productsModels.create(obj)
            return newProduct
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
