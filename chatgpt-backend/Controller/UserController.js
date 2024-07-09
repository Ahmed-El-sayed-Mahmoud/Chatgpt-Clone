const UserSchema = require("../Schemas/UserSchema")
const JWTHelper=require('../Helpers/JWTHelper')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose');
const createHttpError = require("http-errors");
///////////////////////Insert////////////////////////////////////////
const AddUser = async (req, res, next) => {
    const { email, password } = req.body;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await UserSchema.create([{ email: email, password: password }], { session });
      const AccessToken =  await JWTHelper.SignAccessToken(user[0]._id.toString());
      const RefreshToken = await JWTHelper.SignRefreshsToken(user[0]._id.toString());
      await session.commitTransaction();
  
      res.status(201).json({ message: "Successful Registration", AccessToken,RefreshToken});
    } catch (error) {
      await session.abortTransaction();
      next(error); 
    } finally {
      session.endSession();
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







