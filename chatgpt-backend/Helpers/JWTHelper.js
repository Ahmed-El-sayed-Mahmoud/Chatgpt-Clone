const createHttpError = require('http-errors')
const JWT=require('jsonwebtoken')
const RedisClient=require('./RedisInit')

const SignAccessToken = (UserId)=>{
    return new Promise((resolve,reject)=>{
        const PayLoad={
            
        }
        const Secret=process.env.ACCESS_TOKEN_SECRET
        const Options={
            expiresIn:'20h',
            issuer:'AboElseed.com',
            audience:UserId
        }
        JWT.sign(PayLoad,Secret,Options,(error, token)=>{
            if(error)
                return reject(createHttpError.InternalServerError())
            resolve(token)  
        })
    })
}
/* const VerifyJWT=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    if(!token)
        return next(createHttpError.Unauthorized())

    JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
        if(err)
            {
                if(err.name!='JsonWebTokenError')
                    return next(createHttpError.Unauthorized(err.message))
                else
                    return next(createHttpError.Unauthorized())
            }
            
        next()
    })
} */

const VerifyJWT=async (token,type)=>{
    const Secret=type=='Access'? 'ACCESS_TOKEN_SECRET' : 'REFRESH_TOKEN_SECRET'
    return new Promise(async(resolve,reject)=>{
        await JWT.verify(token,process.env[Secret],(err,PayLoad)=>{
            if(err)
                {
                    console.log(err.message)
                    return reject(createHttpError.Unauthorized())
            
                }
                console.log("aud")
                console.log(PayLoad.aud)
            resolve(PayLoad.aud)
        })
    })
}

const SignRefreshsToken = (UserId)=>{
    return new Promise((resolve,reject)=>{
        const PayLoad={
            
        }
        const Secret=process.env.REFRESH_TOKEN_SECRET
        const Options={
            expiresIn:'1y',
            issuer:'AboElseed.com',
            audience:UserId
        }
        JWT.sign(PayLoad,Secret,Options,async(error, token)=>{
            if(error)
                return reject(createHttpError.InternalServerError())

            /* RedisClient.SETEX(UserId,token,(err,res)=>{
                if(err)
                    {
                        console.log(res)
                        //console.log(err.message)
                        return reject(createHttpError.InternalServerError())
                    }
                    
                    resolve(token)
            }); */
           // RedisClient.set(UserId,token,{EX: 365*24*60*60})
           try{
           await RedisClient.set(UserId, token, 'EX', 60 * 60 * 24);
            
            resolve(token)
           }
           catch(e)
           {
             console.log(e.message)
             return reject(createHttpError.InternalServerError())
           }
           
            
        })
    })
}
module.exports={SignAccessToken,VerifyJWT,SignRefreshsToken}