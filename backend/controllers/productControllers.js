import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
//const Product = require('../models/productModel.js')
//const asyncHandler = require('express-async-handler')

//@desc  Fetch all products
//@route GET /api/products
//@access Public

const getProducts = asyncHandler(async (req,res)=>{
     const pageSize = 3 //i recommend 6 per page
     const page = Number(req.query.pageNumber) || 1

 
  const keyword = req.query.keyword ? {
   name: {
     $regex: req.query.keyword,
     $options:'i' //what is this ?? it means case insensitive 
   }
 
 }:{}
   const count = await Product.countDocuments({...keyword})
  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize *(page-1))

  res.json({products,page,pages:Math.ceil(count/pageSize)})
})



//@desc  Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req,res)=>{
  const product = await Product.findOne({_id:req.params.id})
  if(product){res.json(product)}
   else{ res.status(404) /*with the custom error hadler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Product not found')}
})


//@desc  Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req,res)=>{
  const product = await Product.findById(req.params.id)
  if(product){
    await product.remove()
    res.json({message:'Product removed'})
                                    }
   else{ res.status(404) /*with the custom error hadler, if you dont put a res.status, it'll be 500 by default, and you don't have to res.json anymore, it'll just be handled, if yo throw a new error ? please study error handlers */
   throw new Error('Product not found')}
})


//@desc  Create a product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req,res)=>{
   const product = new Product({
     name: 'Sample name',
     price: 0,
     user:req.user._id,
     image:'/images/sample.jpeg',
     brand:"Sample brand",
     category:'Sample category',
     countInStock:0,
     numReviews:0,
     description:'Sample Description' 
   })

   const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})


//@desc  update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req,res)=>{

  const {name,price,description,image,category,countInStock} = req.body

  const product= await Product.findById(req.params.id)

   if(product){
      product.name = name
      product.price  = price
      product.description=description
      product.category = category
      product.brand = brand
      product.countInStock = countInStock
      product.image = image

     const updatedProduct = await product.save()
     res.status(201).json(updatedProduct)
   }else{
     res.status(404)
     throw new Error('Product not found')
   }

})




//@desc  Create new review
//@route POST /api/products/:id/review
//@access Private/Admin
const createProductReview = asyncHandler(async (req,res)=>{

  const {rating,comment} = req.body

  const product= await Product.findById(req.params.id)

   if(product){
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
        res.status(400)
        throw new Error('Product already reviewed')}


      const review ={
        name:req.user.name,
        comment,
        rating:Number(rating),
        user:req.user_id
      }

      product.reviews.push(review)
      product.numReviews = product.reviews.Length
      product.rating = product.reviews.reduce((acc,item) =>{item.rating + acc},0)/product.reviews.length
      await product.save()

      res.status(201).json({message:'Review added'})

   }else{
     res.status(404)
     throw new Error('Product not found')
   }

})


//@desc  Get top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req,res)=>{
  const products = await Product.find({}).sort({rating:-1}).limit(3)
  res.json(products)
})


export {getProducts, getProductById,deleteProduct, createProduct, updateProduct, createProductReview ,getTopProducts}
//exports.getProducts = getProducts
//exports.getProductById = getProductById
//exports.deleteProduct = deleteProduct
//exports.createProduct = createProduct
//exports.updateProduct = updateProduct
//exports.createProductReview = createProductReview
//exports.getTopProducts = getTopProducts