import User from '../models/userModel.js'
//const User = require('../models/userModel.js')

import asyncHandler from 'express-async-handler'
//const asyncHandler = require('express-async-handler')

import generateToken from '../utils/generateToken.js'
//const generateToken = require('../utils/generateToken.js')

/*import xoauth2 from 'xoauth2'*/

import oAuth75Client from '../utils/oAuth.js'

import nodemailer from 'nodemailer'
//const nodemailer = require('nodemailer')

import dotenv from 'dotenv'



dotenv.config()

//@desc  Auth user & get a token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req,res)=>{

  const{email,password} = req.body
   //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const user = await User.findOne({email:email})
  if(user && (await user.matchPassword(password))){
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email, 
      userMessage:user.userMessage,
      adminMessage:user.adminMessage,
      isAdmin:user.isAdmin,
      isMerchant:user.isMerchant,
      token:generateToken(user._id)


    })
  }else{
    res.status(401) //this means unauthorized
    throw new Error('invalid email or password')
  }


})

//@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/clientMessage
//@access Public
const presentClientMessage = asyncHandler(async (req,res)=>{
const {clientMessage, clientId, clientName} = req.body 
console.log(req.body)
    // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
   const user = await User.findByIdAndUpdate(clientId, {userMessage:clientMessage},{useFindAndModify:false})
    /*clientMessage has been changed to string before being passed into the database cuz of app.use(express.json)*/
      

    //what we will use to generate a dynamic access toke
    try{ 
      oAuth75Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});
      const accessToken = await oAuth75Client.getAccessToken()
    
    //setup of email for nodemailer
    let transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:465,
      service:'gmail',
      secure:true,
      debug:false,
      logger:true,
      auth: {
        type:'OAuth2',
        user:process.env.EMAIL,
        clientId:'316000292851-oqq60q7lvft4ha5gnrql7pfkv02n04u4.apps.googleusercontent.com',
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
        accessToken:accessToken/*process.env.ACCESS_TOKEN*/ 
        

      
      }
    })
      //what i actually want to send to the user/client 
     let mailOptions = {
       from: process.env.EMAIL,
       to:'dagogouranta@gmail.com'/*NB: i need the client's email address, when sending from the admin side of things */,
       subject:`Message from client ${clientName} -ID: ${clientId}`, /*consider sending if theyre a merchant or a client */
       text:`${clientMessage}` /*again, is there any conversion from JSON */
      }

      //actually sending the mail
      transporter.sendMail(mailOptions,function(err,data){
         if (err){
           console.log('Error Occured:' , err);
         }else {
            console.log ('Email sent!');
         }

      }) }
      catch(err){
        console.log(err)
      }
      res.status(201) 
  })


  //@desc Set the message that the user wants to convey to the admin
//@route PATCH /api/users/adminMessage
//@access Private Admin
const presentAdminMessage = asyncHandler(async (req,res)=>{
  const {bossMessage, clientId,clientEmail,clientName} = req.body 
  console.log(req.body)
      // i need to reset a particular users message so i have to delete by the id i just recieved, HENCE I NEED ID
     const user = await User.findByIdAndUpdate(clientId, {adminMessage:bossMessage},{useFindAndModify:false})
      /*clientMessage has been changed to string before being passed into the database cuz of app.use(express.json)*/
        

        //what we will use to generate a dynamic access token
        //I did this above earlier, am i covered by function scope-yes
        oAuth75Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})     
        const accessToken = await oAuth2Client.getAccessToken()
          
      //setup of email for nodemailer
      let transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        service:'gmail',
        secure:true,
        debug:false,
        logger:true,
        auth: {
          type:'OAuth2',
          user:process.env.EMAIL,
          clientId:process.env.GOOGLE_CLIENT_ID,
          clientSecret:process.env.GOOGLE_CLIENT_SECRET,
          refreshToken:process.env.REFRESH_TOKEN,
          accessToken:accessToken
        
        }
      })
        //what i actually want to send to the user/client 
       let mailOptions = {
         from: process.env.EMAIL,
         to:clientEmail /*NB: i need the client's email address, when sending from the admin side of things */,
         cc:'dagogouranta@gmail.com',
         subject:`Message from bridgeway customer service to ${clientName}`, /*consider sending if theyre a merchant or a client */
         text:` Dear ${clientName}, ${bossMessage}` /*again, is there any conversion from JSON */
        }
  
        //actually sending the mail
        transporter.sendMail(mailOptions,function(err,data){
           if (err){
             console.log('Error Occurs:' , err);
           }else {
              console.log ('Email sent!');
           }
  
        })

        res.status(201)
    })

//@desc Register a new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req,res)=>{

  const{name, email, password} = req.body
   //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const userExists = await User.findOne({email:email})
  if(userExists){
    res.status(400)
    throw new Error('user already exists!')
  }

  const user = User.create({ //apparently create is syntactic sugar for the save mehod, since creating entails saving i guess
     name:name,
     email:email,
     password:password
  })

   if(user){
     res.status(201).json({
       _id:user._id,
       name:user.name,
       email:user.email,
       userMessage:user.userMessage,
       adminMessage:user.adminMessage,
       isAdmin:user.isAdmin,
       isMerchant:user.isMerchant,
       token:generateToken(user._id)
     })
   }else{
     res.status(400)
     throw new Error('Invalid user data')
   }
})
//@desc  GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req,res)=>{

   //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

const user = await User.findById(req.user._id)
/*the way he names every variable user, he is aware of function scope and he uses it well*/
    if(user){
      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        userMessage:user.userMessage,
        adminMessage:user.adminMessage,
        isAdmin:user.isAdmin,
        isMerchant:user.isMerchant
      })
    }
    else{
      res.status(404)
      throw new Error('User not found')
    }
})

//@desc  update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req,res)=>{

   //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

const user = await User.findById(req.user._id)

    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

    if(req.body.password){
      user.password = req.body.password
      }
      const updatedUser = await user.save()
      res.json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        userMessage:updatedUser.userMessage,
        adminMessage:updatedUser.adminMessage,
        isAdmin:updatedUser.isAdmin,
        isMerchant:updatedUser.isMerchant,
        token:generateToken(updatedUser._id)
      })
    }
    else{
      res.status(404)
      throw new Error('User not found')
    }
})



//@desc  GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers= asyncHandler(async (req,res)=>{

const users = await User.find({})
/*the way he names every variable user, he is aware of function scope and he uses it well*/
 res.json(users)
})

//@desc  delete a user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser= asyncHandler(async (req,res)=>{

const user = await User.findById(req.params.id)
/*the way he names every variable user, he is aware of function scope and he uses it well*/
 if(user){
  await user.remove()
  res.json({message:'User removed'})
 }else{
 res.status(404) //404 is not found
  throw new Error('User not found')
 }

})

//@desc  GET user by id
//@route GET /api/users/:id
//@access Private/Admin
const getUserById= asyncHandler(async (req,res)=>{
  console.log(req.params)
const user = await User.findById(req.params.id).select('-password') //gotta research on this select method, is it mongoose?
if(user){
   res.json(user)
}else{
  res.status(404) //404 is not found
   throw new Error('User not found')
}

})


//@desc  update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req,res)=>{

const user = await User.findById(req.params.id)
/*the way he names every variable user, he is aware of function scope and he uses it well*/
    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin

      const updatedUser = await user.save()
      res.json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        userMessage:updatedUser.userMessage,
        adminMessage:updatedUser.adminMessage,
        isAdmin:updatedUser.isAdmin,
        isMerchant:updatedUser.isMerchant

      })
    }
    else{
      res.status(404)
      throw new Error('User not found')
    }
})


export {authUser,presentClientMessage,presentAdminMessage, getUserProfile, registerUser, 
  updateUserProfile,getUsers,deleteUser, getUserById,updateUser }

//exports.authUser =authUser
//exports.getUserProfile =getUserProfile
//exports.registerUser = registerUser
//exports.updateUserProfile = updateUserProfile
//exports.getUsers = getUsers
//exports.deleteUser = deleteUser
//exports.getUserById = getUserById
//exports.updateUser = updateUser
