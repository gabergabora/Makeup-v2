const express = require('express')
const moment = require('moment')
const Order = require('../models/Order')
const Product = require('../models/Product')
const router = express.Router()
const User = require('../models/User')


router.get('/', async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA) {
            res.render("user/cart/online-cart", {
                userDATA: userDATA,
            })
        } else {
            res.render("user/cart/offline-cart", {
                userDATA: userDATA
            })
        }
    } catch (error) {
        console.error(error)
    }
})
router.get('/offline', async (req, res) => {
    const items = JSON.parse(req.headers.items);
    if (items !== null) {
        const ids = items.map(item => (item._id));
        const products = await Product.find({ _id: { $in: ids } });
        for (let i = 0; i < products.length; i++) {
            products.find(product => {
                if (product._id == items[i]._id) {
                    products[i] = { ...products[i]._doc, qty: items[i].qty };
                }
            })
        };
        res.send(products)
    }
})
router.get("/data/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        res.send(product)
    } catch (error) {
        console.log(error)
    }
})

router.put("/add/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        const unique = await User.findOne({ _id: userID }, {
            cart: { $elemMatch: { id: product.id } }
        })

        const filter = unique.cart.map(x => x.id)

        if (userDATA) {
            if (filter === undefined || filter.length == 0) {
                if(product.size.length > 0) {
                    await User.updateOne({ _id: userID }, {
                        $push: { cart: { size: req.body.size, id: product.id, image: product.image, name: product.name, price: product.price, brand: product.brand, qty: 1 } }
                    })
                } else {
                    await User.updateOne({ _id: userID }, {
                        $push: { cart: { id: product.id, image: product.image, name: product.name, price: product.price, brand: product.brand, qty: 1 } }
                    })
                }
                req.flash("cart-add", "succesful")
                res.redirect("back")
            } else {
                req.flash("ss", "error")
                res.redirect("/")
            }
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        if (userDATA) {

            await User.updateOne({ _id: userID }, {
                $pull: { cart: { id: product.id, image: product.image, name: product.name, price: product.price, brand: product.brand } }
            })

            req.flash("cart-add", "succesful")
            res.redirect("/cart")
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/plus/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA) {
            await User.updateOne({ _id: userID, "cart.id": `${req.params.id}` }, {
                $inc: { "cart.$.qty": +1 }
            })

            res.redirect("/cart")
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/min/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const getElement = await User.findOne({ _id: userID }, {
            cart: { $elemMatch: { id: req.params.id } }
        })
        const getQty = getElement.cart.map(x => x.qty)

        if (userDATA) {
            if (getQty[0] > 1) {
                await User.updateOne({ _id: userID, "cart.id": `${req.params.id}` }, {
                    $inc: { "cart.$.qty": -1 }
                })
            }
            res.redirect("/cart")
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/offline-order", async (req, res) => {
    try {
        const { items, formData } = req.body;
        const info = formData.map(x => x.value)
        const ids = items.map(item => (item._id));
        const products = await Product.find({ _id: { $in: ids } });
        const order = []
        for (let i = 0; i < products.length; i++) {
            products.find(product => {
                if (product._id == items[i]._id) {
                    order.push({ name: products[i].name, qty: items[i].qty, price: products[i].price, brand: products[i].brand })
                    products[i] = { ...products[i]._doc, qty: items[i].qty };
                }
            })
        };
        new Order({
            name: info[0],
            phone: info[3],
            location: info[1],
            area: info[2],
            order: order,
            Date: moment().format("lll")
        }).save()

        res.redirect("/cart")
    } catch (error) {
        console.error(error)
    }
})

router.post("/bill", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const getOrder = await Order.findOne({ name: userDATA.name }).sort({ Date: -1 })

        if (userDATA) {
            const { location, area, phone } = req.body
            const newOrder = [
                new Order({
                    name: userDATA.name,
                    phone: phone,
                    location: location,
                    area: area,
                    order: userDATA.cart,
                    Date: moment().format("lll"),
                    userID: userID,
                })
            ]

            newOrder.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        res.redirect("/cart/bill")
                    }
                })
            })

            await User.updateOne({ _id: userID }, {
                $push: { orders: { id: getOrder._id } }
            })

            await User.updateOne({ _id: userID }, {
                $set: { cart: [] }
            })
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/bill", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const getOrder = await Order.findOne({ userID: userID }).sort({ Date: -1 })
        if (userDATA) {
            res.redirect(`/cart/bill/get/${getOrder._id}`)
        } else {

        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/bill/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const data = await Order.findOne({ _id: req.params.id })
        if (userDATA) {
            res.render("user/cart/bill", {
                userDATA: userDATA,
                data: data
            })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router