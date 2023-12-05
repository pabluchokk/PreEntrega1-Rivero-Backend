import express from "express";
import { cartRouter } from "./routes/carts.routes.js";
import { productRouter } from "./routes/products.routes.js";
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from "./utils.js";
import { ProductManagerFile } from "./managers/ProductManagerFile.js";
import path from 'path'

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => console.log(`Servidor funcionando en el puerto:${PORT}`))
const io = new Server(httpServer)

app.engine("handlebars", engine())
app.set("view engine", "handlebars")

app.set('views', path.join(__dirname, 'views'))

app.use(express.static(__dirname + "/public"))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

io.on('connection', (socket) => {
    console.log('Usuario conectado')
    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
})

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/realtimeproducts', async (req, res) => {
    const productManagerFile = new ProductManagerFile('products.json')
    const products = await productManagerFile.getProducts()
    res.render('realTimeProducts', { productos: products })
})

io.on('connection', (socket) => {
    console.log('Usuario conectado')

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })

    socket.on('updateProducts', async () => {
        const productManagerFile = new ProductManagerFile('products.json')
        const updatedProducts = await productManagerFile.getProducts()
        io.emit('updatedProducts', updatedProducts)
    })
})

app.get('/home', async (req, res) => {
    const productManagerFile = new ProductManagerFile('products.json')
    const products = await productManagerFile.getProducts()
    res.render('home', { productos: products })
})

export default app
// app.listen(PORT, () => {
    //     console.log(`Servidor funcionando en el puerto: ${PORT}`)
// })