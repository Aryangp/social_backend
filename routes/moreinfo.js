const router = require("express").Router()
const path = require('path');
const User = require('../models/users')
const fs = require('fs')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image.jpg']
const multer = require("multer")
// const isAuth= require('../')
const uploadPath = path.join('public', User.photoImageBasePath)
const upload = require("express-fileupload")
const session = require("express-session")
// const upload=multer({
//     dest:uploadPath,
//     fileFilter:(req,file,callback)=>{
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })
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


router.get("/moreinfo", isAuth, (req, res) => {
    res.render("addinfo.ejs")
})

router.post("/moreinfo", async (req, res) => {
    const file1=req.files.cover1
    const file2=req.files.cover2
    const filename1 = req.files.cover1.name
    const filename2 = req.files.cover2.name
    const users = await User.findOne({ email: req.body.email })
    users.firstname = req.body.firstname
    users.lastname = req.body.lastname
    users.address = req.body.address
    users.sex = req.body.sex
    users.photoImageName = filename1
    users.photoImageName2 = filename2
    users.age = req.body.age
    users.birthdate = new Date(req.body.birthdate)
    users.hobbies = req.body.hobbies
    try {
         file1.mv(path.join(uploadPath,"/") +filename1,function(err){
            console.log(err)
         })
         file2.mv(path.join(uploadPath,"/") +filename2,function(err){
            console.log(err)
         })
        await users.save()
        // console.log(users.photoImageName)
        res.redirect("/done")
    } catch (error) {
        console.log(error);
        if (users.photoImageName != null) {
            removephotoCover(users.photoImageName)
        }
        res.redirect("/done/moreinfo")
    }
})

function removephotoCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router;