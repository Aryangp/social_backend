const router = require("express").Router()
const path = require('path');
const User = require('../models/users')
const fs = require('fs')
const session = require("express-session");
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect("/login")
    }
}


router.get("/userProfile", isAuth, (req, res) => {
    res.render("addinfo.ejs")
})

router.post("/userProfile", async (req, res) => {
    const users = await User.findOne({ email: req.body.email })
    users.firstname = req.body.firstname
    users.lastname = req.body.lastname
    users.address = req.body.address
    users.sex = req.body.sex
    users.age = req.body.age
    users.follower=req.body.follower;
    users.followed=req.body.followed;
    users.birthdate = new Date(req.body.birthdate)
    users.hobbies = req.body.hobbies
    try{
        const userData=await users.save();
        res.json(userData);
    }catch(err){
        res.status(400).json({message:err});
    }   
})


module.exports = router;