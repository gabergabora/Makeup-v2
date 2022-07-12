const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcrypt')
const moment = require('moment')

router.get("/register", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        res.render("api/register", {
            userDATA: userDATA,
        })
    } catch (error) {
        console.error(error)
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, location, area, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = [
            new User({
                name: name,
                email: email,
                phone: phone,
                location: location,
                area: area,
                password: hashedPassword,
                Date: moment().format("l")
            })
        ]

        newUser.forEach((data) => {
            data.save((error) => {
                if (error) {
                    console.log(error)
                } else {
                    res.redirect("/api/login")
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
})

router.get("/login", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        res.render("api/login", {
            userDATA: userDATA,
        })
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const userDATA = await User.findOne({ email: email})

        const comparedPassword = await bcrypt.compare(password, userDATA.password)

        if(comparedPassword){
            res.cookie("id", userDATA._id)
            res.redirect("/")
        } else {
            res.send("noe")
        }
    } catch (error) {
        console.log(error)
    }
})


router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("id")
        res.redirect("/api/login")
    } catch (error) {
        console.log(error)
    }
})
module.exports = router