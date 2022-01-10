const express = require("express")
const app = express()
const session = require('express-session')
const dotenv = require("dotenv")
const mongodbSession = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const User = require("./models/users")
const register =require("./routes/register")
const login =require("./routes/login")



dotenv.config()

mongoose.connect(process.env.MONGOOSE_URL)
const db = mongoose.connection
db.on("error", error => console.log(`${error}`))
db.once("open", () => console.log('database connected'))
const store = new mongodbSession({
    uri: "mongodb://localhost/login",
    collection: "mySessions"
})

const port = 5000
app.set("view-engine", 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use("/",register)
app.use("/",login)
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
