const express = require("express")
const User = require("../model/User")
const jwt = require('jsonwebtoken')
const auth = async (req, res,next) => {
    try {
        const token = req.cookies.jwttoken
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        const rootUser = await User.findOne({ _id: verifyUser._id })
        if (!rootUser) {
            throw new Error("user not found")
        }
        else {
            req.token = token;
            req.rootUser = rootUser;
            req.userID = rootUser._id
            next();
        }
    } 
    catch (err) {
        res.status(522).json("Unauthorized: No token provided")
    } 
}
module.exports = auth