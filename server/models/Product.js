const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  brand_name: {
    type: String,
    required: true,
  },
  cost_price: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  expiry_date: {
    type: String,
    required: true,
  },
});

module.exports = Product = mongoose.model("Product", ProductSchema);
