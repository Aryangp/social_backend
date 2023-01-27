const router = require('express').Router()
const User = require("../models/users")
const UserVerification = require("../models/userverify")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const path = require('path');
const alert = require('alert')
require('dotenv').config()


router.get('/register', (req, res) => {
    res.render("register.ejs")
})
router.post("/register", async (req, res) => {
    const { username, email, password,cpassword } = req.body
    let user = await User.findOne({ email })
    if (user) {
        return res.redirect("/register")
    }
    if (user) {
        prompt("already register go to login")
        return res.redirect("/register")
    }
    if (password !== cpassword) {
        prompt("passwords do not match")
        return res.redirect("/register")
    }
    if (password.length<8) {
        prompt("password must be atleast 8 chracters long")
        return res.redirect("/register")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({
        username,
        email,
        password: hashedPassword,
        verified: false,
    })
    const registerUser=await user.save()
    res.json({message:"user created go to login"});

})





module.exports = router 