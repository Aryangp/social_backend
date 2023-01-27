const router =require('express').Router()
const User=require("../models/users")
const bcrypt= require('bcrypt')


router.get('/login', (req, res) => {
    res.render("login.ejs")
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({message:"user not found"})
    }
    // if(user.verified){
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.json({message:"password is incorrect"})

    }
    req.session.isAuth = true
    res.json({message:"login successfull"});

})
module.exports = router