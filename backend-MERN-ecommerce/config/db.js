import mongoose from 'mongoose'
import colors from  'colors'

const connectDB = asnyc() => {

     try{
const conn=  mongoose.connect(process.env.MONGO_URI,{
       useUnifiedTopology:true,
       useNewUrlParser:true,
       useCreateIndex:true
  })
    console.log(`Connected Successfully to database:
      ${conn.connection.host}`.cyan.underline)
     }
     catch(err){
       console.error(`Error:${error}`.red.underline.bold)
       process.exit(1) /*it means that it quits the process
       with failure. 1 is failure, study this*/
     }
}

export default connectDB
