import mongoose from 'mongoose'
//const mongoose= require('mongoose')

const Schema = mongoose.Schema
const reviewSchema = mongoose.Schema({
  name:{type: String ,required:true},
  rating:{type: Number ,required:true},
  comment:{type: String ,required:true},
  user:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'}
}, {timestamps:true})

const productSchema =  mongoose.Schema({
        user:{type:mongoose.Schema.Types.ObjectId,required:true, ref:'User'},
        name:{type: String ,required:true},
        image:{type: String ,required:true},
        vendor:{type: String ,required:true},
        category:{type:String ,required:true}, /*considering removing this category field */
        description:{type:String ,required:true},
        reviews:[reviewSchema],
        rating:{type:Number ,required:true ,default:0},
        numReviews:{type:Number ,required:true ,default:0},
        price:{type:Number ,required:true ,default:0},
        countInStock:{type:Number ,required:true ,default:0},

},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const Product = mongoose.model('Product',productSchema)

/*the this Product you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM/ODM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

//exports.Product = Product
export default Product