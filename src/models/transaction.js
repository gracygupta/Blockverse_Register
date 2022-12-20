const mongoose = require("mongoose");

//defining structure
const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: null,
  },
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    default: null,
  },
});

const Transaction = mongoose.model("Transactions", transactionSchema);
module.exports = Transaction;
