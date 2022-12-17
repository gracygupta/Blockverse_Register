const { send } = require("process");
const Razorpay = require("razorpay");
require("dotenv").config();

const instance = new Razorpay({
  key_id: process.env.razorpay_key_id,
  key_secret: process.env.razorpay_key_secret,
});
const create_orderid = async (req, res) => {
  const amount = 20;
  let options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.status(201).json({
      success: true,
      amount,
      order,
    });
  });
};

//get payment handler
const get_payment = async (req, res) => {
  res.render("checkout");
};

// get.paymet handler
// const get_payment = async (req, res) => {
// //   var option = {
// //     amount: 20 * 100,
// //     currency: "INR",
// //     receipt: "order_rcptid_2022",
// //   };
// //   instance.orders.create(option, function (err, order) {
// //     if (err) {
// //       console.log(err);
// //     } else {
//       res.send({ ORDER_ID: order.id });
//       //   res.render("checkout", {
//       //     key_id: process.env.razorpay_key_id,
//       //     amount: order.amount,
//       //     order_id: order.id,
//       //   });
//     }
//   });
// };

const verify_payment = async (req, res) => {
  console.log(req.body);
  res.send("Thankyou");
  //   const payment_status = "";

  //   let body =
  //     req.body.response.razorpay_order_id +
  //     "|" +
  //     req.body.response.razorpay_payment_id;

  //   var crypto = require("crypto");
  //   var expectedSignature = crypto
  //     .createHmac("sha256", "lIhTEeoU53SwaQIlITg8qT2y")
  //     .update(body.toString())
  //     .digest("hex");
  //   console.log("sig received ", req.body.response.razorpay_signature);
  //   console.log("sig generated ", expectedSignature);
  //   var response = { signatureIsValid: "false" };
  //   if (expectedSignature === req.body.response.razorpay_signature)
  //     response = { signatureIsValid: "true" };
  //   if (response.signatureIsValid == true) {
  //     payment_status = "succesfull";
  //   } else payment_status = "unsuccesfull";

  //   res.send(response);
};

// exporting
module.exports = { get_payment, verify_payment, create_orderid };
