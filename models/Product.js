const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:Object,required:true},
    categories:{type:String,required:true},
    colors:{type:String,required:true},
    size:{type:String,required:true},
    price:{type:Number,required:true},
    discount:{type:Number,required:true},
    moq:{type:String,required:true},
    instock:{type:String, required:true},
},{timestamps:true})

module.exports = mongoose.model("Product",ProductSchema)