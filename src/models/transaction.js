const mongoose = require("mongoose");

//defining structure
const transactionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" },
  order_id: String,
  payment_id: {
    type: String,
    default: null,
  },
  signature: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["success", "failed"],
  },
});

const Transaction = mongoose.model("Transactions", transactionSchema);
module.exports = Transaction;
