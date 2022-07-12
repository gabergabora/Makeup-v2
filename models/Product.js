const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    minDes: {
        type: String,
        required: true,
    },

    des: {
        type: String,
        required: true,
    },

    price: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    score: {
        type: Number,
        required: true,
        default: 0,
    },

    isStock: {
        type: Boolean,
        default: true,
    },

    mainCategory: {
        type: String,
        required: true,
    },

    sideCategory: {
        type: String,
        required: true,
    },
    
    brand: {
        type: String,
        required: true,
    },

    colors: {
        type: Array,
        default: []
    },

    size: {
        type: Array,
        default: []
    },

    colorID: {
        type: String,
    },

    mainProduct:{
        type: String,
    },

    color: {
        type: String,
    },

    size: {
        type: Array,
    },

    Date: {
        type: String,
    }
})

const Product = mongoose.model('Products', productSchema, 'Products')
module.exports = Product