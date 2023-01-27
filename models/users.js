const mongoose= require("mongoose")
const usersSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    firstname:String,
    lastname:String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
     type:String,
     required:true,
    },
    address:String,
    sex: String,
    hobbies:String,
    age:Number,
    birthdate:{
        type:String,
    },
    followed:[{name:String,id:String}],
    follower:Number
})



module.exports=mongoose.model("User",usersSchema)
