const mongoose= require("mongoose")
const photoImageBasePath="uploads/photocover"
const path = require('path');
const usersSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,

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
    photoImageName:String,
    photoImageName2:String,
    age:Number,
    birthdate:{
        type:Date,
    },
    verified:Boolean,
})

usersSchema.virtual("photoImagePath1").get(function(){
    if(this.photoImageName!=null){
      return  path.join('/',photoImageBasePath,this.photoImageName)
    }
})
usersSchema.virtual("photoImagePath2").get(function(){
    if(this.photoImageName2!=null){
      return  path.join('/',photoImageBasePath,this.photoImageName2)
    }
})

module.exports=mongoose.model("User",usersSchema)
module.exports.photoImageBasePath= photoImageBasePath