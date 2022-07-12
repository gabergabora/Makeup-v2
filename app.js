const express = require('express')
const app = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('express-flash');
const session = require('express-session')
const methodOverride = require("method-override")
const User = require('./models/User')
const index = require('./routes/index')
const api = require('./routes/api')
const admin = require('./routes/admin')
const cart = require('./routes/cart')
const MainCategory = require('./models/MainCategory')
const SideCategory = require('./models/SideCategory')
const Product = require('./models/Product')
const Preview = require('./models/Preview')

let PORT = 3000;

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(methodOverride("_method"));

app.use("/api", api);
app.use("/admin", admin)
app.use("/", index)
app.use("/cart", cart);

app.delete("/admin/category/main/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA.isAdmin == true) {
            await MainCategory.deleteOne({ _id: req.params.id })
            req.flash("delete-alert", "تم حذف القسم بنجاح")
            res.redirect("/admin/category/main")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/category/main/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA.isAdmin == true) {
            const name = req.body.name
            const checkName = await MainCategory.findOne({ name: name })

            if (checkName) {
                req.flash("category-edit-unique", "Name been used beofre")
                res.redirect(`/admin/category/main/edit/${req.params.id}`)
            } else {
                await MainCategory.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                    }
                })

                req.flash("edit-success", "Success")
                res.redirect("/admin/category/main")

            }
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/category/side/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            await SideCategory.deleteOne({ _id: req.params.id })
            req.flash("delete-alert", "تم حذف القسم بنجاح")
            res.redirect("/admin/category/side")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/category/side/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })

        if (userDATA.isAdmin == true) {
            const { name, mainCategory } = req.body
            const checkName = await SideCategory.findOne({ name: name })

            if (checkName) {
                req.flash("category-side-edit-unique", "Name been used beofre")
                res.redirect(`/admin/category/side/`)

                await SideCategory.updateOne({ _id: req.params.id }, {
                    $set: {
                        mainCategory: mainCategory,
                    }
                })

            } else {
                await SideCategory.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                        mainCategory: mainCategory,
                    }
                })

                req.flash("edit-success", "Success")
                res.redirect("/admin/category/side")

            }
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/products/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            await Product.deleteOne({ _id: req.params.id })
            req.flash("delete-product-alert", "تم حذف القسم بنجاح")
            res.redirect("/admin/products/all/all")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/edit-product/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id})

        if (userDATA.isAdmin == true) {
            const { name, minDes, des, price, mainCategory, sideCategory } = req.body
            const checkName = await Product.findOne({ name: name })

            if (checkName) {
                req.flash("product-side-edit-unique", "Name been used beofre")

                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        minDes: minDes,
                        des: des,
                        price: price,
                        mainCategory: mainCategory,
                        sideCategory: sideCategory,
                    }
                })

                if(product.colors.length > 0) {
                    await Product.updateMany({ mainProduct: product.id }, {
                        $set: {
                            name: name,
                            minDes: minDes,
                            des: des,
                            price: price,
                            mainCategory: mainCategory,
                            sideCategory: sideCategory,
                        }
                    })
                }

                res.redirect(`/admin/products`)

            } else {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                        minDes: minDes,
                        des: des,
                        price: price,
                        mainCategory: mainCategory,
                        sideCategory: sideCategory,
                    }
                })

                if(product.colors.length > 0) {
                    await Product.updateMany({ mainProduct: product.id }, {
                        $set: {
                            name: name,
                            minDes: minDes,
                            des: des,
                            price: price,
                            mainCategory: mainCategory,
                            sideCategory: sideCategory,
                        }
                    })
                }

                req.flash("edit-success", "Success")
                res.redirect("/admin/products")

            }
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/product/instock/:id", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    isStock: false,
                }
            })
            res.redirect("/admin/products/all/all")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/product/outstock/:id", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    isStock: true,
                }
            })
            res.redirect("/admin/products/all/all")
        }
    } catch (error) {
        console.log(error)
    }
})

app.delete("/admin/preview/delete/:id", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            await Preview.deleteOne({ _id: req.params.id })
            req.flash("delete-preview-alert", "تم حذف القسم بنجاح")
            res.redirect("/admin/preview")
        }
    } catch (error) {
        console.log(error)
    }
})

app.put("/admin/preview/edit/:id", async (req, res) =>{
    try {
        const userID = req.cookies.id
        const userDATA = await User.findOne({ _id: userID })
        if (userDATA.isAdmin == true) {
            const {title, des, type, category} = req.body
            await Preview.updateOne({ _id: req.params.id }, {
                $set: {
                    title : title,
                    des : des,
                    type : type,
                    category : category,
                }
            })

            req.flash("edit-success", "Success")
            res.redirect("/admin/preview")
        }
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.log(`Server is running on port ${PORT}`)
    }
})