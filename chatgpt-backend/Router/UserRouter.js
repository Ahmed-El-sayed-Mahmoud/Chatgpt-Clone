const express = require("express")
const UserMiddleWare = require("../MiddleWare/UserMiddleWare")
const UserController = require("../Controller/UserController")
const ChatController=require("../Controller/ChatController")
const JWTHelper=require("../Helpers/JWTHelper")
const router = express.Router()
router.post("/add", UserMiddleWare.CheckData,UserMiddleWare.ExistMiddleWare,UserController.AddUser)
router.post('/login',UserMiddleWare.CheckData,UserMiddleWare.Login,UserMiddleWare.GenerateNewTokens
    ,UserController.LoggedIn
)
router.get('/home',UserMiddleWare.VerifyAccessToken,UserController.Home)
router.get('/refresh-token',UserMiddleWare.VerifyRefreshTOKEN,UserMiddleWare.GenerateNewTokens)
router.delete('/logout',UserMiddleWare.VerifyRefreshTOKEN,UserMiddleWare.LogOut)
router.post('/isloggedin',UserMiddleWare.VerifyRefreshTOKEN,UserController.IsLoggedIn)
module.exports = router
