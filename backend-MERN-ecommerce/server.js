import express from 'express'
//import products from './data/products.js'
import dotenv from 'dotenv'
import colors from 'colors'
dotenv.config({path:})
import mongoose from '/mongoose'
impor {notFound,errorHandler} from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
connectDB()

 const app = express()

app.use('/api/products',productRoutes)

app.use(notFound)


app.use(errorHandler)

app.get('/', (req,res) =>{
  res.send('API is running...')
})

app.get('/api/products',(req,res) =>{
  res.json(products) /* res.send and res.json both convert the response to json*/
})

app.get('/api/products/:id', (req,res) =>{
  const product = products.find(p => p._id === req.params.id)
  res.json(product)
})

const port=process.env.PORT||5000

app.listen(port, ()=>{
  console.log(`Server is listening in ${process.env.NODE_ENV} mode,
     on port ${port}`.yellow.bold)
})
