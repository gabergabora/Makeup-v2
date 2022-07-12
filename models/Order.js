const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    phone: {
        type: String,
    },

    location: {
        type: String,
    },

    area: {
        type: String,
    },

    order:{
        type: Array,
    },

    userID:{
        type: String,
    },

    type:{
        type: Number,
        default: 0,
    },

    Date: {
        type: String,
    }
})

const Order = mongoose.model('Order', orderSchema, 'Order')
module.exports = Order