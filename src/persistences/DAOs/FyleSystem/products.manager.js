import fs from 'fs'
const path = './database/products.json'
import CustomError from "../../../errors/newError.js";
import { ErrorsCause, ErrorsMessage, ErrorsName } from "../../../errors/errorMessages.js";
import logger from "../../../winston.js";


export default class ProductManager {
    constructor(path){
         this.path = path
    }
    async getProducts(limit,page,sort,query) {
        try {
            if (fs.existsSync(this.path)) {
                let productsFromFile = await fs.promises.readFile(this.path, 'utf-8');
                let productsFromFileStringified = JSON.parse(productsFromFile)
                if (limit) {
                    return productsFromFileStringified.slice(0, limit)
                }
                return productsFromFileStringified
            } else {
                return []
            }
        } catch {
            logger.error(ErrorsMessage.PRODUCT_EMPTYLIST_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_EMPTYLIST_CAUSE,
                message: ErrorsMessage.PRODUCT_EMPTYLIST_ERROR
            });
        }
    }
    async addProduct(obj) {
        try {
            const productsList = await this.getProducts()
            const product = {id: await this.#generarId(),...obj}
            productsList.push(product)
            await fs.promises.writeFile(path,JSON.stringify(productsList))
        } catch {
            logger.error(ErrorsMessage.PRODUCT_ADD_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_ADD_CAUSE,
                message: ErrorsMessage.PRODUCT_ADD_ERROR
            });
        }
    }
    async getProductsByID(id) {
        try {
            const productsList = await this.getProducts()
            return productsList.find((el) => el.id === id)
        } catch {
            logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
                message: ErrorsMessage.PRODUCT_WRONGID_ERROR
            });
        }
    }
    async #generarId() {
        const productsList = await this.getProducts()
        try {
            let id = 1
            if (productsList.length !== 0) {
              id = productsList[productsList.length - 1].id + 1
            }
            return id
        } catch {
            logger.error('Error en la generación del código único del producto.')
        }
    }
    async deleteProduct(id){
        try {
            const productsList = await this.getProducts()
            let newProductsList = productsList.filter((el) => el.id != id);
            await fs.promises.writeFile(path,JSON.stringify(newProductsList))
        } catch {
            logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
                message: ErrorsMessage.PRODUCT_WRONGID_ERROR
            });
        }
    }
    async updateProduct(id,actualizacion){
        try {
           const productsList = await this.getProducts()
           let obj = await this.getProductsByID(id)  
           let objAct = {...obj,...actualizacion}
           const listaAct = await productsList.map((elem) =>{
            if(elem.id=== objAct.id){
                return objAct
            } else{
                return elem
            }
           })
           await fs.promises.writeFile(path,JSON.stringify(listaAct))
        } catch {
            logger.error(ErrorsMessage.PRODUCT_WRONGID_ERROR)
            CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_WRONGID_CAUSE,
                message: ErrorsMessage.PRODUCT_WRONGID_ERROR
            });
        }
    }
}
