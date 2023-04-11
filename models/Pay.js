const mongoose = require("mongoose")

const PaySchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reference: {
        type: String,
        required: true
    }
    
},{timestamps:true})

module.exports = mongoose.model("Pay",PaySchema)