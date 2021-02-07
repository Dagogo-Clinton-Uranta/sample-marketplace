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
    isAdmin:true
  },

  {
    name:'John Doe',
    email:'admin@examapple.com',
    password: hash,
    isAdmin:false //it is false by default ,jst leaving it here for future
  },

  {
    name:'Jane Doe',
    email:'admin@maple.com',
    password: hash,
    isAdmin:false
  }
]

//exports.users =users;
export default users