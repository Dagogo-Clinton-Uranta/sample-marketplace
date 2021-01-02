import brcypt from 'brcyptjs'


const salt = bcrypt.genSalt(10)
const hash = bcrypt.hashPassword(123456,salt)

const users = [
  {
    name:'Admin User',
    email:'admin@emaple.com',
    password: hash,
    isAdmin:true
  },

  {
    name:'John Doe',
    email:'admin@emaple.com',
    password: hash,
    isAdmin:false //itis false by default ,jst leaving it here for future
  },

  {
    name:'Jane Doe',
    email:'admin@emaple.com',
    password: hash,
    isAdmin:false
  },
]

export default users;
