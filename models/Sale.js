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
    type: Float,
    required: true,
  },
  total_transaction_amount: {
    type: Float,
    required: true,
  },
  transaction_date: {
    type: Date,
    required: true,
  },
});

module.exports = Sale = mongoose.model("Sale", saleSchema);
