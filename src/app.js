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
import payments from './routers/payment.routers.js'
import loggerRouter from './routers/logger.router.js'
import { __dirname } from './utilities.js'
import './persistences/MongoDB/dbConfig.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import './passport/passportStrategies.js'
import { addToCartService } from './services/carts.services.js'
import { getProductsService, addProductService, deleteProductService } from './services/products.services.js'
import { getMessagesService, newMessageService } from './services/messages.services.js'
import dotenv from 'dotenv';
dotenv.config();
import config from './config.js'
import CustomError from './errors/newError.js'
import { ErrorsCause, ErrorsMessage, ErrorsName } from "./errors/errorMessages.js";
import logger from './winston.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerSetup } from './swaggerInfo.js'
// Declarations
const app = express()
const port = config.PORT

// Server
const httpServer = app.listen(port, () => {
    logger.info('Listening to port ' + port);
})
const socketServer = new Server(httpServer)
// Socket configuration


socketServer.on('connection', async (socket) => {
    logger.info('cliente conectado');
    //REALTIME PRODUCTS
    //Funcion que escribe los productos en el DOM
    const products = await getProductsService()
    const productsList = products.payload
    socketServer.emit('writeProducts', productsList)
    //Funcion que crea el producto que le llega.
    socket.on('creacionProducto', async (obj) => {
        const products = await getProductsService()
        const productsList = products.payload
        if (await productsList.find((el) => el.code === obj.code)) {
            logger.warn(ErrorsMessage.PRODUCT_REPEATEDCODE_ERROR)
            throw CustomError.createCustomError({
                name: ErrorsName.PRODUCT_ERROR,
                cause: ErrorsCause.PRODUCT_REPEATEDCODE_CAUSE,
                message: ErrorsMessage.PRODUCT_REPEATEDCODE_ERROR
            });
        } else {
            await addProductService(obj)
            const products = await getProductsService()
            const productsList = products.payload
            socketServer.emit('writeProducts', productsList)
        }
    })
    //Funcion que elimina un producto en especifico de la DB.
    socket.on('eliminacionProducto', async (id) => {
        await deleteProductService(id)
        const products = await getProductsService()
        const productsList = products.payload
        socketServer.emit('writeProducts', productsList)
    })
    //Funcion que agrega al carrito el producto seleccionado, le marco la id de forma manual, no tiene sentido hacerlo con la herramienta que tengo ahora para que cada vez que se cargue el page se cree un carrito nuevo. Cuando empiece a trabajar con Sessions creare un cart para cada Session en particular.
    socket.on('añadirAlCarrito', async (id) => {
        await addToCartService("640f8156f6d8813b3d9e580e", id)
    })
    // CHAT 
    socket.on('mensaje', async info => {
        await newMessageService(info)
        const messages = await getMessagesService()
        socketServer.emit('chat', messages)
    })
})

// Handlebars engine
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
// General APP declarations
app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongoUrl: 'mongodb+srv://lucaspanizzo99:Panizzo99@coderhouse.3xliklk.mongodb.net/ecommerce?retryWrites=true&w=majority'
        }),
    })
)
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/', views)
app.use('/api/users', users)
app.use('/jwt', jwt)
app.use('/api/sessions', sessions)
app.use('/loggerTest', loggerRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup))
app.use('/api/payments', payments)

app.use(passport.initialize())
app.use(passport.session())

