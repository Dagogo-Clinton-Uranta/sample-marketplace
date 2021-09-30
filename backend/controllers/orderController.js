import Order from '../models/orderModel.js'
//const Order = require('../models/orderModel.js')

import Account from '../models/accountModel.js'

//const asyncHandler = require('express-async-handler')
import asyncHandler from 'express-async-handler'

//const colors  = require('colors')
import mongoose from 'mongoose'

//@desc  create new order
//@route POST /api/orders
//@access Private

const addOrderItems = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const {orderItems,shippingAddress,paymentMethod, itemsPrice, taxPrice, deliveryCost, totalPrice} = req.body

 if(orderItems && orderItems.length === 0 ){
   res.status(400)
   throw new Error('No order items')
    return
 } else {
   const order = new Order({
     orderItems,
     user:req.user._id, //this will give us the currently logged in user
     shippingAddress,
     /*paymentMethod,*/
     itemsPrice,
     /*taxPrice,*/
     deliveryCost,
     totalPrice
   })

   
   const createdOrder = await Order.create(order)
    
   /*console.log(createdOrder)*/
     
    res.status(201).json(createdOrder)
 }
})


//@desc  Get order by ID
//@route GET /api/orders/:id
//@access Private

const getOrderById = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
   
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const order = await Order.findById(objectId).populate('user', 'name email nuban') /*name and email in the same quotation */
 
  if(order){
     
    res.json(order)
  }
  else{
    res.status(404)
    throw new Error('Order not found')
  }
})


//@desc  Update order to paid
//@route GET /api/orders/:id/pay
//@access Private/Teller
const updateOrderToPaid = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const order = await Order.findById(objectId)
  if(order){
    console.log(order.isPaid)
     order.isPaid = !order.isPaid
     if(order.isPaid = true){
       order.insufficientFunds=false
      }
       else{order.insufficientFunds=true}
     
       order.paidAt = Date.now()
     
     
     const updatedOrder = await order.save()

     res.json(updatedOrder)
  }
  else{
    res.status(404)
    throw new Error('Order not found')
  }
})



//@desc  Update merchants for this order to credited status
//@route GET /api/orders/:id/paymerchants
//@access Private/Teller
const updateMerchantsToCredited = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const order = await Order.findById(objectId)
  if(order){
    console.log(order.merchantsCredited)
     order.merchantsCredited = !order.merchantsCredited
     order.merchantsCreditedAt = Date.now()
     
     
     const updatedOrder = await order.save()

     res.json(updatedOrder)
  }
  else{
    res.status(404)
    throw new Error('Order not found')
  }
})


//@desc  Update order to insufficient Funds
//@route GET /api/orders/:id/funds
//@access Private/Teller
const updateOrderToInsufficientFunds = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
 
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const order = await Order.findById(objectId)
  if(order){
    console.log(order.insufficientFunds)
     if(!order.isPaid){
      order.insufficientFunds = true

     }

     
     
     const updatedOrder = await order.save()

     res.json(updatedOrder)
  }
  else{
    res.status(404)
    throw new Error('Order not found')
  }
})

//@desc  Update order to Delivered
//@route GET /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const order = await Order.findById(objectId)
  if(order){
     order.isDelivered = true,
     order.deliveredAt = Date.now()

     const updatedOrder = await order.save()

     res.json(updatedOrder)
  }
  else{
    res.status(401)
    throw new Error('Order not found')
  }
})


//@desc  get all orders that havent had money deducted from the users' accounts 
//@route GET /api/orders/unpaidorders
//@access Private
const getUnpaidOrders = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const orders = await Order.find({$or:[{isPaid:false},{$and:[{isPaid:true},{merchantsCredited:false},{paidAt:{$lte:new Date(new Date().getTime() -  48 * 60 * 60 * 1000) }}]}]}).sort({createdAt:-1})
   
  res.json(orders)
})



//@desc  get logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const orders = await Order.find({user:req.user._id}).sort({createdAt:-1})
  res.json(orders)
})

//@desc  get all orders
//@route GET /api/orders
//@access Private Admin
const getOrders = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")

  let orders
  let vendorName = 'ADMIN IS REQUESTING'

   if(req.query.vendorName !== '' ){ 
     vendorName = req.query.vendorName 
    console.log(vendorName)}
  
    
   
   vendorName === req.query.vendorName ?(
   orders = await Order.find({ createdAt:{$gte:new Date(new Date().getTime()-96 * 60 * 60 * 1000)}, 'orderItems.vendor':vendorName, isPaid:true }).sort({createdAt:-1}).populate('user','id name nuban')
  
   
   )
   :(vendorName === 'ADMIN IS REQUESTING' &&
     (orders = await Order.find({createdAt:{$gte:new Date(new Date().getTime()-144 * 60 * 60 * 1000)}}).sort({createdAt:-1}).populate('user','id name nuban'))
   )
   
  res.json(orders)
   
})

//@desc  update the merchant's quantity they can deliver
//@route PATCH /api/orders
//@access Private
const updatePromisedQty = asyncHandler(async (req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  const { orderId, productId, updatedQty } =  await req.body
  /*if(req.body){console.log(req.body)}
  else{console.log('nothing dey o')}*/

  for(let i = 0 ;i < productId.length;i++){
  const orderObjectId = new mongoose.Types.ObjectId(orderId)
  const productObjectId = new mongoose.Types.ObjectId(productId[i])
 
 const productToUpdate = await Order.find({'_id':orderObjectId,'orderItems.product':productObjectId})
 console.log(productToUpdate)

if(productToUpdate.length > 0){
   await Order.findOneAndUpdate({'_id':orderObjectId,'orderItems.product':productObjectId},{$set:{'orderItems.$.promisedQty': updatedQty[i] } }, { useFindAndModify: false})
  }
    } 
 
  /*await specificOrder*/
 /*res.json(orders)*/
})

export {addOrderItems, getOrderById, updateOrderToPaid,updateOrderToInsufficientFunds,updateMerchantsToCredited,
updateOrderToDelivered, getMyOrders,getOrders,getUnpaidOrders ,updatePromisedQty}

//exports.addOrderItems =addOrderItems
//exports.getOrderById =getOrderById
//exports.updateOrderToPaid =updateOrderToPaid
//exports.updateOrderToDelivered = updateOrderToDelivered
//exports.getMyOrders =getMyOrders
//exports.getOrders =getOrders