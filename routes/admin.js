const express = require('express')
const User = require('../models/User')
const router = express.Router()
const MainCategory = require('../models/MainCategory')
const moment = require('moment')
const SideCategory = require('../models/SideCategory')
const Product = require('../models/Product')
const multer = require('multer')
const Preview = require('../models/Preview')
const Brand = require('../models/Brand')
const Order = require('../models/Order')
const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/upload/images")
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
})

const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1024 * 1024 * 1000 * 1000,
    }
})

router.get("/category/main", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const mainCategory = await MainCategory.find({}).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/category/category", {
                mainCategory: mainCategory,
                message: req.flash("unique"),
                deleteAlert: req.flash("delete-alert"),
                editSuccess: req.flash("edit-success")
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/category/main", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const checkName = await MainCategory.findOne({ name: req.body.name })

        if (userDATA.isAdmin == true) {

            if (checkName) {
                req.flash("unique", "يوجد قسم بهذا الاسم")
                res.redirect("/admin/category/main")
            } else {
                const name = req.body.name;

                const newMainCategory = [
                    new MainCategory({
                        name: name,
                        Date: moment().format("lll")
                    })
                ]

                newMainCategory.forEach((data) => {
                    data.save((error) => {
                        if (error) {
                            console.error(error)
                        } else {
                            res.redirect("/admin/category/main")
                        }
                    })
                })
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/category/main/edit/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const data = await MainCategory.findOne({ _id: req.params.id })

        if (userDATA.isAdmin == true) {
            res.render("admin/category/edit-category", {
                data: data,
                uniqueError: req.flash("category-edit-unique"),
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/category/side", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const mainCategory = await MainCategory.find({})
        const sideCategory = await SideCategory.find({}).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/category/side-category", {
                mainCategory: mainCategory,
                sideCategory: sideCategory,
                delete_alert: req.flash("delete-alert"),
                editSuccess: req.flash("edit-success"),
                uniqueError: req.flash("category-side-edit-unique"),
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/category/side", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            const { name, mainCategory } = req.body

            const newSideCategory = [
                new SideCategory({
                    name: name,
                    mainCategory: mainCategory,
                    Date: moment().format("lll"),
                })
            ]

            newSideCategory.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        res.redirect("/admin/category/side")
                    }
                })
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/category/side/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const data = await SideCategory.findOne({ _id: req.params.id })
        const mainCategory = await MainCategory.find({})

        if (userDATA.isAdmin == true) {
            res.render("admin/category/eidt-side-category", {
                data: data,
                mainCategory: mainCategory,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/products", (req, res) => { res.redirect("/admin/products/all/all") })

router.get("/products/:category/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const products = await Product.find({ mainProduct: null }).sort({ Date: -1 })
        if (userDATA.isAdmin == true) {
            res.render("admin/products/products", {
                products: products,
                delete_suc: req.flash("delete-product-alert"),
                edit_suc: req.flash("edit-success"),
                unique: req.flash("product-side-edit-unique"),
                edit_img: req.flash("edit-img"),
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/add-product", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const mainCategory = await MainCategory.find({}).sort({ Date: -1 })
        const sideCategory = await SideCategory.find({}).sort({ Date: -1 })
        const brand = await Brand.find({}).sort({ Date: -1 })
        if (userDATA.isAdmin == true) {
            res.render("admin/products/add-product", {
                mainCategory: mainCategory,
                sideCategory: sideCategory,
                brand: brand,
                success: req.flash("add-product-suc"),
                unique: req.flash("unique"),
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})


router.post("/add-product", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })


        if (userDATA.isAdmin == true) {
            const { name, minDes, des, price, mainCategory, sideCategory, brand, color } = req.body
            const checkName = await Product.findOne({ name: name })
            if (checkName) {
                req.flash("unique", "name beed used")
                res.redirect("/admin/add-product")
            } else {
                const newProduct = [
                    new Product({
                        name: name,
                        color: color,
                        minDes: minDes,
                        des: des,
                        price: price,
                        image: req.file.filename,
                        mainCategory: mainCategory,
                        sideCategory: sideCategory,
                        brand: brand,
                        Date: moment().format("lll"),
                    })
                ]

                newProduct.forEach((data) => {
                    data.save((error) => {
                        if (error) {
                            console.log(error)
                        } else {
                            req.flash("add-product-suc", "suc")
                            res.redirect("/admin/add-product")
                        }
                    })
                })
            }
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/edit-product/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const product = await Product.findOne({ _id: req.params.id })
        const mainCategory = await MainCategory.find({})
        const sideCategory = await SideCategory.find({})

        if (userDATA.isAdmin == true) {
            res.render("admin/products/edit-product", {
                product: product,
                mainCategory: mainCategory,
                sideCategory: sideCategory,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/edit-product/:id/add-color", upload.single("image"), async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const random = Math.floor(1000 + Math.random() * 92342 * Math.random() * 482382 * Math.random())
        const product = await Product.findOne({ _id: req.params.id })
        if(userDATA.isAdmin == true) {
            await Product.updateOne({ _id: req.params.id }, {
                $push: { colors: { color: req.body.color, colorID: random, image: req.file.filename}}
            })
            const newProduct = [
                new Product({
                    name: product.name,
                    minDes: product.minDes,
                    des: product.des,
                    price: product.price,
                    image: req.file.filename,
                    Date: moment().format("lll"),
                    colorID: random,
                    size: product.size,
                    mainProduct: product.id,
                    brand: product.brand,
                    mainCategory: product.mainCategory,
                    sideCategory: product.sideCategory
                })
            ]

            newProduct.forEach((data) => {
                data.save()
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.put("/edit-product/:id/add-size", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const random = Math.floor(1000 + Math.random() * 92342 * Math.random() * 482382 * Math.random())

        if(userDATA.isAdmin == true){
            await Product.updateOne({ _id: req.params.id }, {
                $push:{ size: { size: req.body.size, sizeID: random }}
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/product/edit-img/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const product = await Product.findOne({ _id: req.params.id })

        if (userDATA.isAdmin == true) {
            res.render("admin/products/edit-product-img", {
                success: req.flash("add-product-suc"),
                product: product,
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/product/edit-img/:id", upload.single("image"), async (req, res,) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA.isAdmin == true) {
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    image: req.file.filename
                }
            })

            req.flash("edit-img", "success")
            res.redirect("/admin/products")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/preview", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const preview = await Preview.find({}).sort({ Date: -1 })
        if (userDATA.isAdmin == true) {
            res.render("admin/preview/preview", {
                preview: preview,
                previewDelete: req.flash("delete-preview-alert"),
                previewEdit: req.flash("edit-success")
            })
        }
    } catch (error) {
        console.error(error)
    }
})


router.get("/preview/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const mainCat = await MainCategory.find({}).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/preview/add-preview", {
                mainCat: mainCat,
                success: req.flash("add-preview-success")
            })
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/preview/add", upload.single("image"), async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA.isAdmin == true) {
            const { title, des, type, category } = req.body
            const newPreview = [
                new Preview({
                    title: title,
                    des: des,
                    type: type,
                    category: category,
                    image: req.file.filename,
                    Date: moment().format("lll")
                })
            ]

            newPreview.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        req.flash("add-preview-success", "sucesss")
                        res.redirect("/admin/preview/add")
                    }
                })
            })
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/preview/edit/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const mainCategory = await MainCategory.find({})
        const data = await Preview.findOne({ _id: req.params.id })

        if (userDATA.isAdmin == true) {
            res.render("admin/preview/edit-preview", {
                data: data,
                mainCat: mainCategory
            })
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/brand", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const brand = await Brand.find({}).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/brand/brand", {
                brand: brand,
                del: req.flash("brand-deleted")
            })
        }
    } catch (error) {
        console.error(error)
    }
})

router.delete("/brand/delete/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Brand.deleteOne({ _id: req.params.id })
            req.flash("brand-deleted", " ")
            res.redirect("/admin/brand")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/brand/add", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            res.render("admin/brand/add-brand", {
                success: req.flash("success")
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/brand/add", upload.single("image"), async (req, res) => {
    const uesrID = req.cookies.id
    const userDATA = await User.findOne({ _id: uesrID })

    if (userDATA.isAdmin == true) {
        const name = req.body.name

        const newBrand = [
            new Brand({
                name: name,
                image: req.file.filename,
            })
        ]

        newBrand.forEach((data) => {
            data.save((error) => {
                if (error) {
                    console.log(error)
                } else {
                    req.flash('success', ' ')
                    res.redirect("/admin/brand/add")
                }
            })
        });
    }
})

router.get("/brand/edit/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const data = await Brand.findOne({ _id: req.params.id })

        if (userDATA.isAdmin == true) {
            res.render("admin/brand/edit-brand", {
                data: data,
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/brand/edit/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Brand.updateOne({ _id: req.params.id }, {
                $set: { name: req.body.name }
            })
            res.redirect("/admin/brand")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/orders/pending", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const orders = await Order.find({ type: 0 }).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/orders/pending", {
                userDATA: userDATA,
                orders: orders,
                suc: req.flash("order-accept"),
                reject: req.flash("order-reject")
            })
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/bills/get/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const data = await Order.findOne({ _id: req.params.id })

        if (userDATA.isAdmin == true) {
            res.render("admin/orders/bill", {
                userDATA: userDATA,
                data: data,
            })
        }
    } catch (error) {
        console.error(error)
    }
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alkhatuna0boutique@gmail.com',
      pass: 'khatun020$&@'
    }
  });

router.put("/order/accept/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const user = await Order.findOne({ _id: req.params.id })
        const getCustomer = await User.findOne({ _id: user.userID })

        if (userDATA.isAdmin == true) {

            if(getCustomer){
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'alkhatuna0boutique@gmail.com',
                      pass: 'khatun020$&@'
                    }
                  });
    
                  var mailOptions = {
                    from: '"بوتيك الخاتونة " <alkhatuna0boutique@gmail.com>', // sender address
                    to: `${getCustomer.email}`, // list of receivers
                    subject: `لقد تم قبول طلبك`, // Subject line
                    text: 
                    `مرحبا ${getCustomer.name}، لقد تم قبول طلبك من متجر
                    بوتيك الخاتونة، سيتم تجهيز الطلب و ارساله اليك باسرع وقت ممكن
                    نتمنى لك يوم جميل`, 
                  };
    
                   transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }

            await Order.updateOne({ _id: req.params.id }, {
                $set: { type: 1 }
            })

            req.flash("order-accept", " ")
            res.redirect("/admin/orders/pending")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/order/reject/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Order.updateOne({ _id: req.params.id }, {
                $set: { type: 2 }
            })
            req.flash("order-reject", " ")
            res.redirect("/admin/orders/pending")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/order/success/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Order.updateOne({ _id: req.params.id }, {
                $set: { type: 4 }
            })
            req.flash("order-success", " ")
            res.redirect("/admin/orders/accepted")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/order/return/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Order.updateOne({ _id: req.params.id }, {
                $set: { type: 3 }
            })
            req.flash("order-return", " ")
            res.redirect("/admin/orders/accepted")
        }
    } catch (error) {
        console.log(error)
    }
})


router.delete("/order/delete/:id", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })

        if (userDATA.isAdmin == true) {
            await Order.deleteOne({ _id: req.params.id })
            req.flash("order-deleted", " ")
            res.redirect("/admin/orders/rejected")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/orders/accepted", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const orders = await Order.find({ type: 1 }).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/orders/accepted", {
                userDATA: userDATA,
                orders: orders,
                suc: req.flash("order-success"),
                ret: req.flash("order-return")
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/orders/rejected", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const orders = await Order.find({ type: 2 }).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/orders/rejected", {
                userDATA: userDATA,
                orders: orders,
                del: req.flash("order-deleted"),
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/orders/return", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const orders = await Order.find({ type: 3 }).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/orders/return", {
                userDATA: userDATA,
                orders: orders,
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/bills", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const userDATA = await User.findOne({ _id: uesrID })
        const orders = await Order.find({ type: 4 }).sort({ Date: -1 })

        if (userDATA.isAdmin == true) {
            res.render("admin/bills/bills", {
                userDATA: userDATA,
                orders: orders,
            })
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router