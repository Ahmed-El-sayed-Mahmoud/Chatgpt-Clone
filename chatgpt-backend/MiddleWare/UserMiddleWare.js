const Joi = require("joi");
const UserSchema = require("../Schemas/UserSchema");
const createHttpError = require("http-errors");
const bcrypt = require("bcrypt");
const JWTHelper = require("../Helpers/JWTHelper")
const RedisClient=require("../Helpers/RedisInit")
//////////////////////////////////////////////////////
const ExistMiddleWare = async (req, res, next) => {
  const { email, password } = req.body;
  try
  {
   console.log("before database")
    console.log("connection url : ",process.env.CONNECTION_URL)
    const user = await UserSchema.findOne({ email });
    console.log("after database")
    if (user == null) {
      return next();
    } else {
      //return res.status(409).send({error:{message:' An Account with this email already exist'}})
      return next(
        createHttpError.Conflict("An Account with this email already exist")
      );
    }
  } catch (e) {
    return next(e);
  }
};

const CheckData = async (req, res, next) => {
  console.log("checkkkk")
  const { email, password } = req.body;
  if (!email | (email == "") || !password || password == "") {
    return res.status(400).send({ error: { message: "Fill all Fieldas" } });
  }
  const ValidationSchema = Joi.object({
    email: Joi.string().lowercase().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      RefreshToken:Joi.optional()
  });

  const { error, value } =  ValidationSchema.validate(req.body);
  if (error) {
    console.log("error checking")
    console.log(error.message)
    return next(createHttpError.BadRequest("Invalid Email or Password"));
  } else {
    next();
  }
};

const VerifyRefreshTOKEN = async (req, res, next) => {
  const  RefreshToken  = req.cookies.refreshtoken;
  console.log("Refresh Token : ",RefreshToken)
  if(!RefreshToken)
    return next(createHttpError.Unauthorized())
  let userId;
  try {
    userId = await JWTHelper.VerifyJWT(RefreshToken, "Refresh");
    //console.log("refres")
    //console.log(userId)
    const RedisToken= await RedisClient.get(userId)
    if(RedisToken!=RefreshToken)
    {
      console.log("Redis Token :" ,RedisToken)
      console.log("not matching with redis")
      return next((createHttpError.Unauthorized()))
    }
      
    req.userId=userId
    return next()
    
  } catch (err) {
    return next(createHttpError.Unauthorized());
  }
};
const GenerateNewTokens=async(req,res,next)=>{
  console.log("generating new tokeeeens")
  try{
    const userId=req.userId
    console.log(userId)
    if(!userId)
    {
      return next(createHttpError.BadRequest())
    }
    const NewAccessToken = await JWTHelper.SignAccessToken(userId);
    console.log("new access",NewAccessToken)
    const NewRefreshToken = await JWTHelper.SignRefreshsToken(userId);
    console.log("new refresh",NewAccessToken)
    res.cookie('accesstoken','Bearer '+NewAccessToken,{maxAge:5*60*1000,sameSite:'none',secure:true})
    res.cookie('refreshtoken',NewRefreshToken,{maxAge:10*60*1000, httpOnly:true,secure:true , sameSite: 'none'})
    res.status(200).send({AccessToken:NewAccessToken  });
  }
  catch(e)
  {
    console.log("error generating new tokens: ",error )
    return next(createHttpError.Unauthorized())
  }
  
  
}
const VerifyAccessToken=async (req,res,next)=>{
  //const BearerToken=req.cookies['accesstoken'];
  const BearerToken=req.cookies.accesstoken;
  console.log("Acess Token",BearerToken)
  if(!BearerToken)
    return next(createHttpError.Unauthorized())

    const token=BearerToken.split(" ")[1];
    console.log(token)
    if(!token)
        return next(createHttpError.Unauthorized())
      try{
         req.body.userId= await JWTHelper.VerifyJWT(token,'Access')
         return next()
      }
      catch(e)
      {
        
        return next(createHttpError.Unauthorized())
      }

}
const Login=async (req,res,next)=>{
  try{
      //console.log("logggg")
      const {email,password}=req.body
      const user= await UserSchema.findOne({email})
      if(!user)
         next(createHttpError.Unauthorized("Wrong Email or Password"))
      let IsMatch=await bcrypt.compare(password,user.password)
      if(IsMatch)
        {
          req.userId=user._id.toString()
          return next()
        }
        else{
          next(createHttpError.Unauthorized("Wrong Email or Password"))
        }


  }
  catch(error)
  {
    next(error)
  }
};
const LogOut=async(req,res,next)=>{
    try{
        const userId=req.userId
        RedisClient.del(userId)
        res.status(204).send()

    }
    catch(e)
    {

    }
}
module.exports = {
  ExistMiddleWare,
  CheckData,
  VerifyRefreshTOKEN,
  GenerateNewTokens,
  VerifyAccessToken,
  Login,
  LogOut,
  
};
