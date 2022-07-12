const mongoose = require('mongoose');

const mainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    Date: {
        type: String,
    }
})

const MainCategory = mongoose.model("Main Category", mainCategorySchema, "Main Category")
module.exports = MainCategory