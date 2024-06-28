const bcrypt=require('bcrypt')
const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
email:{
    type:String,
    required:true,
    lowercase:true,
    unique:true
},
password:{
    type:String,
    required:true
}
})

UserSchema.pre('save',async function (next){
try{
    const salt= await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(this.password,salt)
    this.password=hashedPassword
}
catch(err)
{
    next(err)
}
})

module.exports=mongoose.model('user',UserSchema)
