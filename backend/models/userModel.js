import mongoose from 'mongoose'
import bcrypt from  'bcryptjs'
//const mongoose= require('mongoose')
//const bcrypt= require('bcryptjs')

const Schema = mongoose.Schema
//the use of "Schema" on it's own below is simply the use of the constant above, i later changed it to bypass this constant
const userSchema =  mongoose.Schema({

        name:{type: String ,required:true},
        email:{type: String ,required:true, unique:true},
        password:{type: String ,required:true},
        isAdmin:{type: Boolean ,required:true, default:false},
        isMerchant:{type: Boolean ,required:true, default:false},
        momFirstName:{type: String ,required:true},
        shoeSize:{type: String ,required:true},
        closestFriend:{type: String ,required:true},
        childhoodStreet:{type: String ,required:true},
        firstEmployment:{type: String ,required:true},
        userMessage:{type: String ,required:false},
        adminMessage:{type: String ,required:false},
        userMessageNotification:{type:Boolean , default:false},
        adminMessageNotification:{type:Boolean , default:false},
        pickupAddress:{type: String ,required:false}
        /* maybe an address entry for merchants ? */
        /*maybe an account number entry, so we can verify that you have an account at bridgeway */

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})

userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre('save', async function(next){
   if(!this.isModified('password')){
     next()  //.isModified is part of mongoose ? what do they traditionally use it for ? this pre is mongooses middleware though
   }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('User',userSchema)

/*the this User you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

//exports.User = User
export default User