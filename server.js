const express = require("express")
const app = express()
const session = require('express-session')
const dotenv = require("dotenv")
const mongodbSession = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const User = require("./models/users")
const alert= require("alert")



dotenv.config()

mongoose.connect(process.env.MONGOOSE_URL)
const db = mongoose.connection
db.on("error", error => console.log(`${error}`))
db.once("open", () => console.log('database connected'))
const store = new mongodbSession({
    uri: "mongodb://localhost/login",
    collection: "mySessions"
})

const port = 3000
app.set("view-engine", 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect("/login")
    }
}
app.get("/", (req, res) => {


    res.render("index.ejs")
})
app.get('/login', (req, res) => {
    res.render("login.ejs")
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {

        alert("You have not register to app")   
        return res.redirect("/register")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.redirect("/login")

    }
    req.session.isAuth = true
    res.redirect("/done")
})
app.get('/register', (req, res) => {
    res.render("register.ejs")
})
app.post("/register", async (req, res) => {
    const { username, email, password, cpassword } = req.body
    let user = await User.findOne({ email })
    if (user) {
        alert("already register go to login")
        return res.redirect("/register")
    }
    if (password !== cpassword) {
        alert("passwords do not match")
        return res.redirect("/register")
    }
    if (password.length<8) {
        alert("password must be atleast 8 chracters long")
        return res.redirect("/register")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({
        username,
        email,
        password: hashedPassword,
    })
    await user.save();

    res.redirect("/login")

})
app.get("/done", isAuth, (req, res) => {
    res.render("done.ejs")
})
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/")
    })


})

app.listen(port, () => {
    console.log(`server has started on ${port}`);
})
