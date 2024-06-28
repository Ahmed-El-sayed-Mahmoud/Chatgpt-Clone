const mongoose=require("./Connection/DatabaseConnection")
const UserSchema=require("./Schemas/UserSchema")
const UserRouter=require("./Router/UserRouter")
const express = require('express')
const createHttpError = require('http-errors')
const morgan = require('morgan')
const RedisClient=require('./Helpers/RedisInit')
require('dotenv').config()

const app=express()
app.use(morgan('dev'))
app.use(express.json())

app.get('/',async(req,res,next)=>{
    res.send("Hello from Server")
})
app.use('/user',UserRouter)
app.use(async(req,res,next)=>{
next(createHttpError.NotFound("Something Went Wromg :("))
})

app.use((err,req,res,next)=>{
    return res.status(err.status).send({
        error:{
            status:err.status,
            message:err.message
        }
    })

})

//RedisClient.SET("ahmed","elsayed")
const PORT= process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})