const Razorpay = require("razorpay");
var crypto = require("crypto");
require("dotenv").config();
const Transaction = require("../models/transaction");

const key_id = process.env.razorpay_key_id;
const key_secret = process.env.razorpay_key_secret;
const expireTime = 1000 * 60 * 60;

const instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

// get payment handler
const get_payment = async (req, res) => {
  res.render("checkout", {
    razorpay_key: key_id,
  });
};

// create order ID
const create_orderid = async (req, res) => {
  try {
    const amount = 20;
    let options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    let order = await instance.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (e) {
    console.log(e);
  }
};

// payment signature verification
const verify_payment = async (req, res) => {
  let body = req.body.order_id + "|" + req.body.payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body.toString())
    .digest("hex");
  if (expectedSignature === req.body.signature) {
    // storing successful transaction
    await Transaction.create({
      email: req.body.lemail,
      status: req.body.discription,
      payment_id: req.body.payment_id,
      order_id: req.body.order_id,
      signature: req.body.signature,
    });
    // res.redirect("/cookie");
  } else {
    await Transaction.create({
      email: req.body.lemail,
      status: req.body.discription,
      payment_id: req.body.payment_id,
      order_id: req.body.order_id,
    });
  }
};

// exporting
module.exports = { get_payment, create_orderid, verify_payment };
