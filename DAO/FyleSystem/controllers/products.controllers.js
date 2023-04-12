import fs from 'fs'
const path = './database/products.json'


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
        } catch (error) {
            console.log(error);
        }
    }
    async addProduct(obj) {
        try {
            const productsList = await this.getProducts()
            const product = {id: await this.#generarId(),...obj}
            productsList.push(product)
            await fs.promises.writeFile(path,JSON.stringify(productsList))
        } catch (error) {
            console.log(error);
        }
    }
    async getProductsByID(id) {
        try {
            const productsList = await this.getProducts()
            return productsList.find((el) => el.id === id)
        } catch (error) {
            console.log(error)
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
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(id){
        try {
            const productsList = await this.getProducts()
            let newProductsList = productsList.filter((el) => el.id != id);
            await fs.promises.writeFile(path,JSON.stringify(newProductsList))
        } catch (error) {
            console.log(error)
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
        } catch (error) {
            console.log(error)
        }
    }
}
