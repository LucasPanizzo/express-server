import fs from 'fs'
const path = './database/carts.json'
const pathProducts = './database/products.json'



export default class cartManager {
    constructor(path) {
        this.path = path
    }
    async getCarts() {
        try {
            if (fs.existsSync(path)) {
                const carts = await fs.promises.readFile(path, 'utf-8')
                return JSON.parse(carts)
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }
    async getCartByID(id) {
        try {
            const cartsList = await this.getCarts()
            return await cartsList.find((el) => el.id === id);
        } catch (error) {
            console.log(error)
        }
    }
    async addCart() {
        try {
            const cartsList = await this.getCarts()
            const newCart = {
                id: await this.#generarId(),
                products: []
            }
            cartsList.push(newCart)
            await fs.promises.writeFile(path, JSON.stringify(cartsList))
        } catch (error) {
            console.log(error);
        }
    }
    async #generarId() {
        try {
            const cartsList = await this.getCarts()
            let id = 1
            if (cartsList.length !== 0) {
                id = cartsList[cartsList.length - 1].id + 1
            }
            return id
        } catch (error) {
            console.log(error)
        }
    }
    async addToCart(idCart, idProduct) {
        try {
            const cartsList = await this.getCarts()
            const arrayProds = await await cartsList.find((el) => el.id === idCart).products
            const exists = await arrayProds.find((el) => el.idProduct === idProduct)
            if (exists) {
                const add = exists.quantity + 1
                const act = { "quantity": add }
                const objAct = { ...exists, ...act }
                arrayProds.splice(arrayProds.indexOf(exists), 1)
                arrayProds.push(objAct)
                const listaAct = await arrayProds.map((elem) => {
                    if (elem.idProduct === objAct.idProduct) {
                        return objAct
                    } else {
                        return elem
                    }
                })
                await fs.promises.writeFile(path, JSON.stringify(cartsList, ...listaAct))
            } else {
                const quantity = 1
                const prodArray = { idProduct, quantity }
                await arrayProds.push(prodArray)
                const listaAct = await cartsList.map((elem) => {
                    if (elem.id === prodArray.id) {
                        return prodArray
                    } else {
                        return elem
                    }
                })
                await fs.promises.writeFile(path, JSON.stringify(listaAct))
            }
        } catch (error) {
            console.log(error)
        }
    }

}
const inst = new cartManager
async function test() {

    await inst.addToCart(1, 3)
}
//test()
