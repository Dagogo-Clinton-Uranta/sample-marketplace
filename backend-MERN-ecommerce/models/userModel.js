import mongoose from 'mongoose'

const Schema = mongoose.schema

const userSchema =  Schema({

        name:{type: String ,required:true},
        email:{type: String ,required:true, unique:true},
        password:{type: String ,required:true},
        isAdmin:{type: Boolean ,required:true, default:false}
},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const User = mongoose.model('User',userSchema)

/*the this User you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

export default User
