import { getProducts,getProductsByID,addProduct,deleteProduct,updateProduct,addMockingProducts,getMockingProducts } from "../persistences/persistences/ProductsPersistence.js";

export async function getProductsService(limit, page, sort, query){
    const products = await getProducts(limit, page, sort, query)
    return products
}

export async function getProductsByIDService(productID){
    const product = await getProductsByID(productID)
    return product
}

export async function addProductService(product){
    const newProduct = await addProduct(product)
    return newProduct
}

export async function deleteProductService(productID){
    const deletedProduct = await deleteProduct(productID)
    return deletedProduct
}

export async function updateProductService(productID, act){
    const updatedProduct = await updateProduct(productID, act)
    return updatedProduct
}

export async function addMockingProductsService(){
    const mockings = await addMockingProducts()
    return mockings
}

export async function getMockingProductsService(){
    const mockingsList = await getMockingProducts()
    console.log('entra services');
    return mockingsList
}
