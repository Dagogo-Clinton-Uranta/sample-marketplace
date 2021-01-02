import mongoose from 'mongoose'

const Schema = mongoose.Schema

const orderSchema =  Schema({

        user:{type: mongoose.Schema.Types.ObjectId,required:true ,ref:'User'},
        order:[
             name:{type: String ,required:true},
             qty:{type: Number,required:true},
             image:{type: String ,required:true},
             price:{type: Number ,required:true},
             product:{

               type: mongoose.Schema.Types.ObjectId,
               required:true,
               ref:'product'

             },
        ],
        shippingAddress:{

        address:{type: String ,required:true},
        city:{type: String ,required:true},
        postalCode:{type: String ,required:true},
        Country:{type: String ,required:true},
      },

        paymentMethod:{
          type: String,
          required:true  },

        paymentResult:{
          /*these results what are to come from paypal*/
          id:{String},
          status:{String},
          update_time:{String},
          email_address:{String} },

        taxPrice:{
          type: String,
          required:true,
          default:0.0 },

        shippingPrice:{
          type: String,
          required:true,
          default:0.0 },

        totalPrice:{
          type: String,
          required:true,
          default:0.0 },

        isPaid:{
          type: Boolean,
           },
           paidAt:{
             type: Date,
              },

          isDelivered:{
          type: Boolean,
          required:true,
          default:false },

          deliveredAt:{
            type: Date,
             },



},{timestamps:true /*you want a createdAt? you add timestamps:true*/})


const User = mongoose.model('Order',orderSchema)

/*the this User you export, you set a new instance
 of it anytime you want to save it to database
 N.B MongoDB uses mongoose ORM unlinke SQL databases cuz
 sql databases come with a structure that you put in through a GUI*/

export default Order
