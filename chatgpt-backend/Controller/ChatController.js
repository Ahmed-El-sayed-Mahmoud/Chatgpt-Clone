const createHttpError = require("http-errors");
const ChatSchema = require("../Schemas/ChatSchema");
const { json } = require("express");

const AddMessages = async (req, res, next) => {
  try {
    const { messages, conversationId,  name } = req.body;
    if (!messages || messages == [] || !conversationId ) {
      return next(createHttpError.BadRequest());
    }
    const conv = await ChatSchema.findById(conversationId);
    if (!conv) {
      return next(createHttpError.NotFound("Conversation not found"));
    }
    conv.messages.push(...messages);
    await conv.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding messages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const AddChat = async (req, res, next) => {
  const { name, userId } = req.body;
  console.log(userId)
  if (!name || !userId) return next(createHttpError.BadRequest());
   conv= await ChatSchema.create({ userId: userId, name: name })
  return res.status(200).send({conversation:conv});
}
const GetChat=async(req,res,next)=>{
    try
    {
        const {conversationId}=req.body
        if(!conversationId)
            return next(createHttpError.BadRequest("Conversation not found"))
        const conv= await ChatSchema.findById(conversationId)
        if(!conv)
            return next(createHttpError.NotFound("conversation not Found :("))
        res.status(200).send({messages:conv.messages})
    }
    catch(error)
    {

    }


}
const DeleteChat=async(req,res,next)=>{
    try{
      const conversationId = req.query.id;
        const conv=ChatSchema.findById(conversationId)
        if(!conv)
            return next(createHttpError.NotFound("conversation not Found :("))
       await  ChatSchema.findByIdAndDelete(conversationId)
        res.status(200).send({success:true,message:"Chat deleted Successfully"})
    }
    catch(err)
    {
        console.error("Error adding messages:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}
const GetAll=async(req,res,next)=>{
  console.log("-----------------------------------------------------------------------------------******-*****")
    try{
        const{userId}=req.body
        
        convs= await ChatSchema.find({userId:userId}).sort({ timestamp: -1 });
        console.log("lolololololoo")
        return res.status(200).json({chats:convs})
    }
    catch(err)
    {
            console.log(err)
    }
}

module.exports={AddChat,AddMessages,GetChat,DeleteChat,GetAll}