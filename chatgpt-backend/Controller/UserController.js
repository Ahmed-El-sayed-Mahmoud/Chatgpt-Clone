const UserSchema = require("../Schemas/UserSchema")
const JWTHelper=require('../Helpers/JWTHelper')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose');
const createHttpError = require("http-errors");
///////////////////////Insert////////////////////////////////////////
const AddUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      await UserSchema.create([{email:email,password:password}])
      res.status(201).json({ message: "Successful Registration"});
    } catch (error) {
      console.log(error)
      next(error); 
    } 
  };
  const Home=async(req,res,next)=>{
    res.send("Home Page")
  }
  const LoggedIn=async(req,res,next)=>{
    res.send({message:"Succefful Login"})
  }
  const IsLoggedIn=async(req,res,next)=>{
    res.status(200).json({logged:true})
  }

module.exports = { AddUser ,Home ,LoggedIn,IsLoggedIn}







