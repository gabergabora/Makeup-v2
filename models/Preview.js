const mongoose = require('mongoose');

const previewSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },

    des:{
        type: String,
        required: true,
    },

    type:{
        type: String,
        required: true,
    },
    
    category:{
        type: String,
    },
    
    image:{
        type: String,
        required: false,
    },

    Date:{
        type: String,
    },
})

const Preview = mongoose.model('Preview', previewSchema, 'Preview')
module.exports = Preview