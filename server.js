const express = require("express")
const app = express()
const session = require('express-session')
const dotenv = require("dotenv")
const mongodbSession = require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const User = require("./models/users")
const register =require("./routes/register")
const bodyParser=require("body-parser")
const login =require("./routes/login")
const moreinfo= require("./routes/moreinfo")
const https = require("https")
const fs = require('fs')
const path = require('path')
const upload =require("express-fileupload")
dotenv.config()

mongoose.connect(process.env.MONGOOSE_URL)
const db = mongoose.connection
db.on("error", error => console.log(`${error}`))
db.once("open", () => console.log('database connected'))
const store = new mongodbSession({
    uri: "mongodb+srv://uniqusStore:p6gXzwE79UbZ2bOJ@cluster0.zjtshle.mongodb.net/?retryWrites=true&w=majority",
    collection: "uniqusStore"
})
const port = 3000
app.set("view-engine", 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:"10mb",extended:false}))
app.use(express.json())
app.use(upload())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use("/",register)
app.use("/",login)
app.use("/done",moreinfo)
app.use("/user",require("./routes/userDetail"));
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.json({message:"you are not authorized"})
    }
}
app.get("/", (req, res) => {
    res.json({message:"welcome to the home page"});
})

    
app.get("/done", isAuth, async(req, res) => {
    const users= await User.find({})
    res.json(users);
})
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.json({message:"you have been logged out"});
    })
})

app.listen(port, () => {
    console.log(`server has started on ${port}`);
})

