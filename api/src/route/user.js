const express = require("express")
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require("../model/User")
const auth = require("../authenticate/auth")
// get user
router.get("/", auth, (req, res) => {
    const { password, tokens, ...user } = req.rootUser._doc
    res.status(200).json(user)
})

// register
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            res.status(522).json("Plz fill all the fileds properly");
        }
        else {
            const userExist = await User.findOne({ email: email })
            if (userExist) {
                res.status(522).json("email has been already registered");
            }
            else {
                const newUser = new User(req.body)
                await newUser.save()
                res.status(200).json("Registered Successfully");
            }
        }
    }
    catch (err) {

        res.status(522).json(err);
    }
})



// login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(522).json("Plz fill all the fileds properly");
        }
        else {
            const user = await User.findOne({ email: email })
            if (user) {
                const VerifyfyPass = await bcrypt.compare(password, user.password)
                if (VerifyfyPass) {
                    const token = await user.generateTokenId();
                    res.cookie("jwttoken", token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true
                    })
                    const { password, tokens, ...other } = user._doc
                    return res.status(200).json(other)
                }
                else {
                    res.status(522).json("Invalid credentials");
                }
            }
            else {
                res.status(522).json("Invalid credentials");
            }
        }
    }
    catch (err) {
        res.status(522).json(err);
    }
})

// change profilePicture
router.post("/profileImg", async (req, res) => {
    try {
        const { _id, path } = req.body
        const update = await User.findByIdAndUpdate(_id, { profileImg:path })
        if (update) {
            res.status(200).json("profile Img changed successfully")
        }
        else {
            res.status(522).json("Opps! something went wrong")
        }
    }
    catch (err) {
        res.status(522).json("Oops! something went wrong")
    }
})

// logout
router.delete("/logout", auth, async (req, res) => {
    const user = await User.findOne({ _id: req.userID })
    req.rootUser.tokens = []
    res.clearCookie("jwttoken", { path: "/" })
    await req.rootUser.save()
    res.status(200).send("Logout Succeessfully")
})


module.exports = router