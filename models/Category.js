const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
