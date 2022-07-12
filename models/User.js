const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    phone: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    area: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    cart:{
        type: Array,
        default: []
    },

    wishlist: {
        type: Array,
        default: []
    },

    orders: {
        type: Array,
        default: []
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    Date: {
        type: String,
    }
})

const User = mongoose.model("Users", userSchema, "Users")
module.exports = User