import bcrypt from 'bcryptjs'
//const bcrypt = require('bcryptjs')
const dummyPassword = '123456'
const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync(dummyPassword,salt)

const users = [
  {
    name:'Admin User',
    email:'admin@emaple.com',
    password: hash,
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
    isAdmin:false,
    isMerchant:true,
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