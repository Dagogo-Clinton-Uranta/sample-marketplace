import bcrypt from 'bcryptjs'
//const bcrypt = require('bcryptjs')
const dummyPassword = '0284'
const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync(dummyPassword,salt)

const users = [
  {
    name:'Admin User',
    email:'admin@emaple.com',
    password: hash,
    nuban:1000,
    isAdmin:true,
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance',
    notes:''
  },

  {
    name:'John Doe',
    email:'john@yahoo.com',
    password: hash,
    nuban:1200000895,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'Jane Doe',
    email:'jane@yahoo.com',
    password: hash,
    nuban:3000,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    isTeller:true,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'Adijat Odubanjo',
    email:'odubanjoadijat@bridgewaymfb.com',
    password: hash,
    nuban:4000,
    isAdmin:false, //it is false by default ,you're keeping it here because you said it's required
    isMerchant:false,
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance'
    
  },

  {
    name:'OKOLI LTD',
    email:'okoli@yahoo.com',
    password: hash,
    nuban:5000,
    isAdmin:false,
    isMerchant:true,
    merchantAddress:"Dolphin estate, ilupeju way",
    userMessage:'hi',
    adminMessage:'hi',
    momFirstName:'Amelia',
    shoeSize:'44',
    closestFriend:'Jamil',
    childhoodStreet:'Eti-Osa Way',
    firstEmployment:'Niger Insurance',
    notes:''
  }
]

//exports.users =users;
export default users