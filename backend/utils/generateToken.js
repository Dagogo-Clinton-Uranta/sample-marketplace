import jwt from 'jsonwebtoken';
//const jwt = require('jsonwebtoken')

const generateToken = (id) => {
   return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'30d'})
//this simple jwt.sign with 3 arguments is how you generate jwt tokens
}

//exports.generateToken = generateToken
export default generateToken