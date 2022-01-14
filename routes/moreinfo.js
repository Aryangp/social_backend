const router = require("express").Router()
const path= require('path');
const User = require('../models/users')
const fs = require('fs')
const imageMimeTypes=['image/jpeg','image/png','image/gif','image.jpg']
const multer= require("multer")
// const isAuth= require('../')
const uploadPath= path.join('public',User.photoImageBasePath)
const session = require("express-session")
const upload=multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
// const storage = multer.diskStorage({
//     destination:uploadPath,
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
   
// var upload = multer({ storage: storage })

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect("/login")
    }
}


router.get("/moreinfo",isAuth,(req, res)=>{
    res.render("addinfo.ejs")
})

router.post("/moreinfo",upload.single('cover1') ,async (req, res)=>{
    
    console.log(req.file)
   const users = await User.findOne({email:req.body.email})
   users.firstname=req.body.firstname
   users.lastname=req.body.lastname
   users.address=req.body.address
   users.sex=req.body.sex
   users.photoImageName=req.file.filename
   
   users.age=req.body.age
   users.birthdate=new Date(req.body.birthdate)
   users.hobbies=req.body.hobbies
try{
    await users.save()
    console.log(users.photoImageName)
    res.redirect("/done")
}catch(error){
  console.log(error);
  if(users.photoImageName!= null){
    removephotoCover(users.photoImageName)
   }
  res.redirect("/done/moreinfo")
}
})

function removephotoCover(fileName){
    fs.unlink(path.join(uploadPath,fileName),err=>{
        if(err) console.error(err)
    })
}

module.exports= router;