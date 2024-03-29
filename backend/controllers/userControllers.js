import User from '../models/userModel.js'
//const User = require('../models/userModel.js')

import asyncHandler from 'express-async-handler'
//const asyncHandler = require('express-async-handler')

import generateToken from '../utils/generateToken.js'
//const generateToken = require('../utils/generateToken.js')

/*import xoauth2 from 'xoauth2'*/

import {google} from 'googleapis';

import nodemailer from 'nodemailer'
//const nodemailer = require('nodemailer')

import dotenv from 'dotenv'

import mongoose from 'mongoose'

//I'm using this bit of code to  convert my strings to object Id


dotenv.config()

//@desc  Auth user & get a token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { email, password } = req.body
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const user = await User.findOne({ email: email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userMessage: user.userMessage,
      adminMessage: user.adminMessage,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
      token: generateToken(user._id)


    })
  } else {
    res.status(401) //this means unauthorized
    throw new Error('invalid email or password')
  }


})

//@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/clientMessage
//@access Public
const presentClientMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { clientId, clientMessage, clientName } =  await req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
  await User.findByIdAndUpdate({_id:objectId}, { userMessage: clientMessage , adminMessageNotification:true , userMessageNotification:false}, { useFindAndModify: false })
  /*clientMessage has been changed to string before being passed into the database cuz of app.use(express.json)*/


  //what we will use to generate a dynamic access token
  const oAuth75Client = new google.auth.OAuth2( process.env.GOOGLE_CLIENT_ID,  process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI)
  
  oAuth75Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = oAuth75Client.getAccessToken().catch(console.error)
     console.log(oAuth75Client)
  try{
    

    //setup of email for nodemailer
    let transporter =   nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      secure: true,
      debug: false,
      logger: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    })
    //what i actually want to send to the user/client 
    let mailOptions = {
      from: process.env.EMAIL,
      to: 'smartsoft_mikeo@yahoo.com',
      subject: `Message from client: ${clientName}, --ID: ${clientId}`, 
      text: `${clientMessage}` 
    }

    //actually sending the mail
      transporter.sendMail(mailOptions , function (err, data) {
      if (err) {
        console.log('Error Occured:', err);
      } else {
        console.log('Email sent!');
      }

    })
  }
   catch(error){
    console.log(error)
  }
  res.status(201)
})


//@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/adminMessage
//@access Private Admin
const presentAdminMessage = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { bossMessage, clientId, clientEmail, clientName } = req.body
  console.log(req.body)
  const objectId = new mongoose.Types.ObjectId(clientId)
  // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
  await User.findByIdAndUpdate({_id:objectId}, { adminMessage:bossMessage, adminMessageNotification:false , userMessageNotification:true}, { useFindAndModify: false })
 


  //what we will use to generate a dynamic access token
  //I did this above earlier, am i covered by function scope-yes
  /*oAuth75Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
  const accessToken = await oAuth75Client.getAccessToken().token

  //setup of email for nodemailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true,
    debug: false,
    logger: true,
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken

    }
  })
  //what i actually want to send to the user/client 
  let mailOptions = {
    from: process.env.EMAIL,
    to: clientEmail ,
    cc: 'dagogouranta@gmail.com',
    subject: `Message from bridgeway customer service to ${clientName}`, 
    text: ` Dear ${clientName}, ${bossMessage}` 
  }

  //actually sending the mail
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error Occurs:', err);
    } else {
      console.log('Email sent!');
    }

  })*/

  res.status(201)
})

 //@desc  Verify a user before payment
//@route POST /api/users/verify
//@access Public


const verifyUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const {clientId ,personalIdQuery, personalIdAnswer } = req.body
  const objectId = new mongoose.Types.ObjectId(clientId)
  const user = await User.findById(objectId)  
   
  /*console.log(user)*/
    
  switch(personalIdQuery){
  case 'momFirstName': 
  if(user && user.momFirstName === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'shoeSize':
  if(user && user.shoeSize === personalIdAnswer){
    return res.send({confirmedState:'true'})
  }
   else{
    return res.send({confirmedState:'false'})
   }

  case 'closestFriend':
   if(user && user.closestFriend === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
   }
    else{
      return res.send({confirmedState:'false'})
    
   }
    
  case 'childhoodStreet':
  if(user && user.childhoodStreet === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
  }
   else{
    return res.send({confirmedState:'false'})
    
   }
  case  'firstEmployment':
  if(user && user.firstEmployment === personalIdAnswer){
    return res.send({confirmedState:'true'})
    
  }
   else{
    return res.send({confirmedState:'false'})
    
   }
      
  default: return res.send({confirmedState:'false'})
  
}
  
})



//@desc Register a new user
// route GET api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const { name, email, password ,momFirstName,shoeSize,closestFriend,childhoodStreet, firstEmployment,isMerchant,pickupAddress } = req.body
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const userExists = await User.findOne({ email: email })
  if (userExists) {
    res.status(400)
    throw new Error('user already exists!')
  }

  const user = User.create({ //apparently create is syntactic sugar for the save mehod, since creating entails saving i guess
    name: name,
    email: email,
    password: password,
    momFirstName:momFirstName,
    shoeSize:shoeSize,
    isMerchant:isMerchant,
    isAdmin:false,
    pickupAddress:pickupAddress,
    closestFriend:closestFriend,
    childhoodStreet:childhoodStreet,
    firstEmployment:firstEmployment,
    userMessageNotification:false,
    adminMessageNotification:false,
  })

  console.log(user)

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userMessage: user.userMessage,
      adminMessage: user.adminMessage,
      isAdmin: user.isAdmin,
      userMessageNotification:user.userMessageNotification,
      adminMessageNotification:user.adminMessageNotification,
      isMerchant: user.isMerchant,
      token: generateToken(user._id),
      pickupAddress:user.pickupAddress,
      momFirstName:user.momFirstName,
      shoeSize:user.shoeSize,
      closestFriend:user.closestFriend,
      childhoodStreet:user.childhoodStreet,
      firstEmployment:user.firstEmployment
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})
//@desc  GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     console.log(req.user._id)
     const objectId = new mongoose.Types.ObjectId(req.user._id)
  const user = await User.findById(objectId)
  
  /*I am using function scope to  name all my return objects user, and it works, cuz of scope*/
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userMessage: user.userMessage,
      adminMessage: user.adminMessage,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc  update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  
       //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own
     const objectId = new mongoose.Types.ObjectId(req.user._id)
  
     const user = await User.findById(objectId)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userMessage: updatedUser.userMessage,
      adminMessage: updatedUser.adminMessage,
      isAdmin: updatedUser.isAdmin,
      isMerchant: updatedUser.isMerchant,
      token: generateToken(updatedUser._id)
    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})



//@desc  GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const users = await User.find({})
  
  res.json(users)
})

//@desc  delete a user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params._id)
  const user = await User.findById(objectId)
  
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404) //404 is not found
    throw new Error('User not found')
  }

})

//@desc  GET user by id
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  /*console.log(req.params)*/
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  const user = await User.findById(objectId).select('-password') //gotta research select
  if (user) {
    res.json(user)
  } else {
    res.status(404) //404 is not found
    throw new Error('User not found')
  }

})


//@desc  update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.header("Access-Control-Allow-Origin","*")
  const objectId = new mongoose.Types.ObjectId(req.params.id)
  
  const user = await User.findById(objectId)
  /*the way he names every variable user, he is aware of function scope and he uses it well*/
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userMessage: updatedUser.userMessage,
      adminMessage: updatedUser.adminMessage,
      isAdmin: updatedUser.isAdmin,
      isMerchant: updatedUser.isMerchant

    })
  }
  else {
    res.status(404)
    throw new Error('User not found')
  }
})


export {
  authUser, presentClientMessage, presentAdminMessage, getUserProfile, registerUser,
  updateUserProfile, getUsers, deleteUser, getUserById, updateUser,verifyUser
}

//exports.authUser =authUser
//exports.getUserProfile =getUserProfile
//exports.registerUser = registerUser
//exports.updateUserProfile = updateUserProfile
//exports.getUsers = getUsers
//exports.deleteUser = deleteUser
//exports.getUserById = getUserById
//exports.updateUser = updateUser
