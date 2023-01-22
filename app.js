const express = require('express')
const ProductManager = require('./index')
const app = express()
const port = 8080

const server = app.listen(port,()=>{
    console.log('Listening to port 8080');
})

const inst = new ProductManager

app.get('/',(req,res)=>{
    res.send('Puerto 8080')
})

app.get('/products', async (req,res)=>{
    const productList = await inst.getProducts()
    const {limit} = req.query
    const productosLimit = productList.slice(0,limit)
    res.json({productList:productosLimit})
})

app.get('/products/:idProduct',async (req,res)=>{
    const productList = await inst.getProducts()
    const {idProduct} = req.params
    const searchedProduct = productList.find(p=>p.id===parseInt(idProduct))
    if(searchedProduct){
        res.json({mesage:'Producto encontrado',searchedProduct})
    } else {
        res.json({mesage:'Producto no encontrado'})
    }
})