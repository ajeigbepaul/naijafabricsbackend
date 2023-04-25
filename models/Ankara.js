const mongoose = require("mongoose");

const AnkaraSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    image: { type: Object, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    discprice: { type: Number },
    moq: { type: String, required: true },
    instock: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ankara", AnkaraSchema);
