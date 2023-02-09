import express from 'express'
import ProductManager from './controllers/products.controllers.js'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import views from './routers/views.router.js'
import products from './routers/products.routers.js'
import carts from './routers/carts.router.js'
import { __dirname } from './utilities.js'
const app = express()
const port = 8080
const inst = new ProductManager

const httpServer = app.listen(port,()=>{
    console.log('Listening to port 8080');
})

const socketServer = new Server(httpServer)

socketServer.on('connection',async(socket)=>{
    console.log('cliente conectado');
    const productsList = await inst.getProducts()
    socketServer.emit('writeProducts',productsList)
    
    socket.on('creacionProducto',async(obj)=>{
        const productsList = await inst.getProducts()
        if(await productsList.find((el) => el.code === obj.code)){
            console.log(productsList);
            console.log('El producto que quieres agregar ya existe');
        } else{
        await inst.addProduct(obj)
        const productsList = await inst.getProducts()
        socketServer.emit('writeProducts',productsList)
        } 
    })

    socket.on('eliminacionProducto',async(id)=>{
        await inst.deleteProduct(id)
        const productsList = await inst.getProducts()
        socketServer.emit('writeProducts',await productsList)
    })
})

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/',views)