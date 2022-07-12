const mongoose = require('mongoose');
const URI = "mongodb://localhost:27017/MakeUP_eShop"

mongoose.connect(URI, (error) => {
    if(error) throw error;
    console.log("Database connected")
})