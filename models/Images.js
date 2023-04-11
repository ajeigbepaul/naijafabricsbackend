const mongoose = require("mongoose")

const ImagesSchema = new mongoose.Schema({
      
        images: [
                {
                    public_id: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
               ],
       productid:{type:String, required:true}
      
    
},{timestamps:true})

module.exports = mongoose.model("Images",ImagesSchema)