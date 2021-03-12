import User from '../models/userModel.js'
//const User = require('../models/userModel.js')
import asyncHandler from 'express-async-handler'
//const asyncHandler = require('express-async-handler')
import generateToken from '../utils/generateToken.js'
//const generateToken = require('../utils/generateToken.js')

//@desc  Auth user & get a token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req,res)=>{

  const{email,password} = req.body
   //req.body will give us the object thats sent in the body of our front end/POSTMAN JSON, take note
  /* res.send({email,  this res,send was just done for example btw
     password}) */ //res.send accepts an object i think and not just variables, take note...hese are part of the things that you have to research on yor own

  const user = await User.findOne({email:email})
  if(user && (await user.matchPassword(password))){
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email, 
      isAdmin:user.isAdmin,
      isMerchant:user.isMerchant,
      token:generateToken(user._id)


    })
  }else{
    res.status(401) //this means unauthorized
    throw new Error('invalid email or password')
  }


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
/*the way he names every variable user, he is aware of function scope and he uses it well*/
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
const user = await User.findById(req.params.id)/*.select('-password')*/ //gotta research on this select method, is it mongoose?
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
        isAdmin:updatedUser.isAdmin,
        isMerchant:updatedUser.isMerchant

      })
    }
    else{
      res.status(404)
      throw new Error('User not found')
    }
})


export {authUser , getUserProfile, registerUser, 
  updateUserProfile,getUsers,deleteUser, getUserById,updateUser }

//exports.authUser =authUser
//exports.getUserProfile =getUserProfile
//exports.registerUser = registerUser
//exports.updateUserProfile = updateUserProfile
//exports.getUsers = getUsers
//exports.deleteUser = deleteUser
//exports.getUserById = getUserById
//exports.updateUser = updateUser
