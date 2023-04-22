import { getProductsService, getProductsByIDService, addProductService, deleteProductService, updateProductService } from "../services/products.services.js";

export const getProductsController = async (req, res) => {
    try {
        const { limit, page, sort, ...query } = req.query
        const products = await getProductsService(limit, page, sort, query)
        res.send(products)
    } catch (error) {
        console.log(error);
    }
}

export const getProductsByIDController = async (req, res) => {
    try {
        const { idProduct } = req.params
        const searchedProduct = await getProductsByIDService(idProduct)
        if (searchedProduct) {
            res.json({ message: 'Producto encontrado', searchedProduct })
        } else {
            res.send('Producto no encontrado')
        }
    } catch (error) {
        console.log(error);
    }
}

export const addProductController = async (req, res) => {
    try {
        const products = await getProductsService()
        const productsList = products.payload
        if (!req.body.title || !req.body.description || !req.body.code || !req.body.price || !req.body.stock || !req.body.status || !req.body.category || !req.body.thumbnails) {
            res.send('Debes completar todos los campos necesarios para crear un producto. Estos son: title,description,code,price,stock,category,status y thumbnails.');
        } else {
            if (productsList.find((el) => el.code === req.body.code)) {
                res.send(`El producto con el code: ${req.body.code} ya existe.`);
            } else {
                await addProductService(req.body)
                res.send('Producto creado con exito.')
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const deleteProductController = async (req,res)=>{
    try {
        const {idProduct} = req.params
        let productoEliminado = await getProductsByIDService(idProduct)
        if (productoEliminado) {
            await deleteProductService(idProduct)
            res.send('Producto eliminado con exito')
        } else {
            res.send('Producto a elminar no encontrado en la base de datos.')
        }
    } catch (error) {
        console.log(error); 
    }
}

export const updateProductController = async (req,res)=>{
    try {
        const {idProduct} = req.params
        const actualizacion = req.body
        let productoModificado = await getProductsByIDService(idProduct)
        if (productoModificado) {
            await updateProductService(idProduct,actualizacion)
            res.send('Producto modificado con exito')
        } else {
            res.send('Producto a modificar no encontrado en la base de datos.')
        }
    } catch (error) {
        console.log(error); 
    }
}