const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    price: { type: String, trim: true, required: true },
    image: { type: String, trim: true, required: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
