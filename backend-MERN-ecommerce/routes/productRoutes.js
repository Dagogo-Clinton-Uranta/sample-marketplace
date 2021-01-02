import express from 'express'
import dotenv from 'dotenv'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
import colors from 'colors'
dotenv.config({path:})
import mongoose from '/mongoose'
import connectDB from './config/db.js'

const router = express().Router

//@Fetch all products
//@GET api/products/
//@Public access
//@this is good commenting syntax,leting others know the routes
router.get('/',asyncHandler(async(req,res) =>{
    const products = await Product.find({})
  res.json(products) /* res.send and res.json both convert the response to json*/
}))
//@Fetch single product
//@GET api/products/:id
//@@Public access
//THIS ASYNC HANDLER AND RES.STATUS, YOU NEED TO KNOW WHAT THEY ARE
router.get('/:id',asynHandler(async(req,res) =>{
  const product = await Product.findOne({_id:req.params.id})
  if(product){res.json(product)}
   else{ res.status(404).json({message:'Product not found'})}
}))


export default router;
