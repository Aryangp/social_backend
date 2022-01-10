const mongoose=require("mongoose")

const usersVerificationSchema=new mongoose.Schema({
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date,
   
})


module.exports=mongoose.model("UserVerification",usersVerificationSchema)