import express from 'express'
import products from './routers/products.routers.js'
import carts from './routers/carts.router.js'
import { __dirname } from './utilities.js'
const app = express()
const port = 8080

const server = app.listen(port,()=>{
    console.log('Listening to port 8080');
})



app.get('/',(req,res)=>{
    res.send('Puerto 8080')
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.use('/api/products', products)
app.use('/api/carts', carts)