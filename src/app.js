// Imports
import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import views from './routers/views.router.js'
import products from './routers/products.router.js'
import carts from './routers/carts.router.js'
import users from './routers/users.router.js'
import jwt from './routers/jwt.router.js'
import sessions from './routers/sessions.router.js'
import { __dirname } from './utilities.js'
import './persistences/MongoDB/dbConfig.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import './passport/passportStrategies.js'
import config from './config.js'
import { addToCartService } from './services/carts.services.js'
import { getProductsService,addProductService,deleteProductService } from './services/products.services.js'
import { getMessagesService,newMessageService } from './services/messages.services.js'
// Declarations
const app = express()
const port = config.PORT

// Server
const httpServer = app.listen(port,()=>{
    console.log('Listening to port '+port);
})
const socketServer = new Server(httpServer)
// Socket configuration


socketServer.on('connection',async(socket)=>{
    console.log('cliente conectado');
    //REALTIME PRODUCTS
        //Funcion que escribe los productos en el DOM
    const products = await getProductsService()
    const productsList = products.payload
    socketServer.emit('writeProducts',productsList)
    //Funcion que crea el producto que le llega.
    socket.on('creacionProducto',async(obj)=>{
        const products = await getProductsService()
        console.log(obj);
        const productsList = products.payload
        if(await productsList.find((el) => el.code === obj.code)){
            console.log('El producto que quieres agregar ya existe');
        } else{
        await addProductService(obj)
        const products = await getProductsService()
        const productsList = products.payload
        socketServer.emit('writeProducts',productsList)
        } 
    })
    //Funcion que elimina un producto en especifico de la DB.
    socket.on('eliminacionProducto',async(id)=>{
        await deleteProductService()
        const products = await getProductsService()
        const productsList = products.payload
        socketServer.emit('writeProducts',productsList)
    })
    //Funcion que agrega al carrito el producto seleccionado, le marco la id de forma manual, no tiene sentido hacerlo con la herramienta que tengo ahora para que cada vez que se cargue el page se cree un carrito nuevo. Cuando empiece a trabajar con Sessions creare un cart para cada Session en particular.
    socket.on('añadirAlCarrito',async(id)=>{
        await addToCartService("640f8156f6d8813b3d9e580e",id)
    })
    // CHAT 
    socket.on('mensaje',async info=>{
        await newMessageService(info)
        const messages = await getMessagesService()
        socketServer.emit('chat',messages)
    })
})

// Handlebars engine
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')
// General APP declarations
app.use(
    session({
      secret: 'secretKey',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        mongoUrl: config.URLMONGO
      }),
    })
  )
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/',views)
app.use('/api/users',users)
app.use('/jwt',jwt)
app.use('/api/sessions',sessions)

app.use(passport.initialize())
app.use(passport.session())