import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
dotenv.config()
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const port = process.env.PORT || 5000;
connectDb()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Cookie parser middleware
app.use(cookieParser())



app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send({
    clientId: process.env.PAYPAL_CLIENT_ID
}))

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
    console.log('production')
}
else {
    app.get('/', (req, res) => {
        res.send('Api is running')
    })
}


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`server running on port ${port}`))