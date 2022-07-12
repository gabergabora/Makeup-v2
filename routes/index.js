const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Preview = require('../models/Preview');
const Product = require('../models/Product');
const MainCategory = require('../models/MainCategory');
const SideCategory = require('../models/SideCategory');
const Brand = require('../models/Brand');

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        const preview = await Preview.find({}).sort({ Date: -1 })
        const product = await Product.find({ mainProduct: null }).sort({ Date: -1 }).limit(11);
        const brand  = await Brand.find({}).sort({ Date: -1})
            res.render("user/index", {
            userDATA: userDATA,
            preview: preview,
            product: product,
            brand: brand,
            addError: req.flash("ss"),
            add: req.flash("cart-add")
        })
    } catch (error) {
        console.error(error);
    }
})

router.get("/category/:name/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        if(req.params.filter == "all"){
            const products = await Product.find({ mainCategory: req.params.name, mainProduct: null })
            const sideCategory = await SideCategory.find({ mainCategory: req.params.name })
            res.render("user/categories", {
                userDATA: userDATA,
                products: products,
                sideCategory: sideCategory,
                cat: req.params.name,
            })
        } else {
            const products = await Product.find({ sideCategory: req.params.filter })
            const sideCategory = await SideCategory.find({ mainCategory: req.params.name })
            res.render("user/categories", {
                userDATA: userDATA,
                products: products,
                sideCategory: sideCategory,
                cat: req.params.name
            })
        }
    } catch (error) {
        console.error(error);
    }
})

router.get("/product/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        const data = await Product.findOne({ _id: req.params.id })
        res.render("user/meida/product", {
            userDATA: userDATA,
            data: data,
            add: req.flash("cart-add")
        })
    } catch (error) {
        console.error(error);
    }
})

router.get("/product/get-colored/:random", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        const data = await Product.findOne({colorID: req.params.random})
        const product = await Product.findOne({ _id: data.mainProduct })

        res.render("user/meida/colored", {
            userDATA: userDATA,
            data: data,
            product: product,
            add: req.flash("cart-add")
        })

    } catch (error) {
        console.log(error);
    }
})

router.get("/brand", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        const brand = await Brand.find({ mainProduct: null }).sort({ Date: -1 })

        res.render("user/brand", {
            userDATA: userDATA,
            brand: brand
        })
    } catch (error) {
        console.error(error);
    }
})

router.get("/get-brand/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({_id: userID})
        const products = await Product.find({ brand: req.params.name })

        res.render("user/get-brand", {
            userDATA: userDATA,
            products: products
        })
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;