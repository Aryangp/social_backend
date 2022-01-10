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
        return res.redirect("/register")
    }
    if(user.verified){
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.redirect("/login")

    }
    req.session.isAuth = true
    res.redirect("/done")
}else{
    console.log("you are not verified")
    res.redirect("verified2.ejs")
}
})
module.exports = router