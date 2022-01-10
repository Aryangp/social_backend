const router = require('express').Router()
const User = require("../models/users")
const UserVerification = require("../models/userverify")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const path = require('path');
require('dotenv').config()

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tomwayen07@gmail.com",
        pass: "aryangupta05",
    }
})
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("ready for message");
        console.log(success);
    }
})
router.get('/register', (req, res) => {
    res.render("register.ejs")
})
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
        return res.redirect("/register")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({
        username,
        email,
        password: hashedPassword,
        verified: false,
    })
    await user.save().then((results) => {
        sendVerifiedEmail(results, res)
    });

    res.redirect("/login")

})

function sendVerifiedEmail({ _id, email }, res) {
    const currentUrl = "http://localhost:5000/"
    const uniqueString = uuidv4() + _id;
    const mailOption = {
        from: "tomwayen07@gmail.com",
        to: email,
        subject: "Verify your Email",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>this link will expire in
      6 hours</p><p>press <a href='${currentUrl + "user/verify" + _id + "/" + uniqueString} '>here</a>to proceed</p>`,

    }
    const saltRound = 10
    bcrypt.hash(uniqueString, saltRound).then((hashedUniqueString) => {
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,

        });
        newVerification.save().then(() => {
            transporter.sendMail(mailOption).then(() => {
                res.json({ status: "pending" })
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }).catch(() => {
        console.log('error happened')
    })
}
// do check to crrect user router
router.get("/user/verify:userId/:uniqueString", (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerification.find({ userId }).then((result) => {
        if (result.length > 0) {
            const { expiresAt } = result[0]
            const hashedUniqueString = result[0].uniqueString
            if (expiresAt < Date.now()) {
                UserVerification.deleteOne({ userId }).then((result) => {
                    User.deleteOne({ _id: userId }).then(() => {
                        let message = "link has expired please sign up again"
                        console.log(message)
                        res.redirect("/user/verified")
                    })
                }).catch((error) => {
                    let message = "clearing user with expired unquie string failed "
                    console.log(message)
                    res.redirect("/user/verified")
                })
                    .catch((error) => {
                        console.log(error)
                        let message = "An error occured while clearing expired user verification "
                        console.log(message)
                        res.redirect("/user/verified")
                    })
            } else {
                bcrypt.compare(uniqueString, hashedUniqueString).then((result) => {
                    if (result) {
                        User.updateOne({ _id: userId }, { verified: true }).then(() => {
                            UserVerification.deleteOne({ userId }).then(() => {
                                let message = "verified"
                                console.log(message)
                                res.redirect("/login")
                            }).catch((error) => {
                                let message = "An error occured while finalizing successfully verification "
                                console.log(message)
                                res.redirect("/login")
                            })
                        }).catch((error) => {
                            console.log(error)
                            let message = "An error occured while updating user record "
                            console.log(message)
                            res.redirect("/user/verified")
                        })
                    } else {
                        let message = "invalid verification details enterd .check your inbox again "
                        console.log(message)
                        res.redirect("/user/verified")
                    }
                }).catch((error) => {
                    let message = "an error occured while comparing unique string "
                    console.log(message)
                    res.redirect("/user/verified")
                })
            }
        } else {
            let message = "Account doesn't exist or has been verified already.please sign up or log in"
            console.log(message)
            res.redirect("/user/verified")
        }
    }).catch((error) => {
        let message = "an error has occured while checking for exist"
        console.log(message)
        res.redirect("/user/verified")
    })
})

router.get("/user/verified", (req, res) => {

    res.render("verified2.ejs",{message:"you are not verified"})
})


module.exports = router 