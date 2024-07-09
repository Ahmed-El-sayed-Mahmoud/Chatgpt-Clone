const express = require("express")
const UserMiddleWare = require("../MiddleWare/UserMiddleWare")
const UserController = require("../Controller/UserController")
const ChatController=require("../Controller/ChatController")
const router = express.Router()

router.post('/add-chat',UserMiddleWare.VerifyAccessToken,ChatController.AddChat)
router.post('/get-chat',UserMiddleWare.VerifyAccessToken,ChatController.GetChat)
router.post('/add-msgs',UserMiddleWare.VerifyAccessToken,ChatController.AddMessages)
router.delete('/delete-chat',UserMiddleWare.VerifyAccessToken,ChatController.DeleteChat)
router.get('/get-all',UserMiddleWare.VerifyAccessToken,ChatController.GetAll)
module.exports = router
