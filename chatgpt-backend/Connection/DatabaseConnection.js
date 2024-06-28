const dotenv=require("dotenv").config()
const mongoose=require("mongoose")
mongoose.connect(process.env.CONNECTION_URL).then(()=>{
    console.log("MongoDB Connected")
})
.catch(err=>console.log(err.message))

mongoose.connection.on('connected',()=>{
    console.log('Connected To Cloud')
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})

module.exports=mongoose