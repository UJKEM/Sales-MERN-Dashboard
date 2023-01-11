const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saleSchema = new Schema({
  transaction_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total_transaction_amount: {
    type: Number,
    required: true,
  },
  transaction_date: {
    type: String,
    required: true,
  },
});

module.exports = Sale = mongoose.model("Sale", saleSchema);
