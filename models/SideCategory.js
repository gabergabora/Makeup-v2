const mongoose = require('mongoose');

const sideCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },

    mainCategory:{
        type: String,
        required: true,
    },
    
    Date:{
        type: String,
    }
})

const SideCategory = mongoose.model('Side Category', sideCategorySchema ,'Side Category')
module.exports = SideCategory