const express = require("express");
const router = express.Router();
const passport = require("passport");

//middlewares import
const token_breaker = require("../middleware/googleAuth");
const check = require("../middleware/check");

//controllers
require("../controller/passportAuth");
const callbackHandle = require("../controller/callbackHandler");
const control = require("../controller/controls");
const razorpay = require("../controller/razorpay");

// const razorpay = require("../controller/razorpay");
// const Team = require("../models/team");
// const Transaction = require("../models/transaction");

//home route
router.get("/", function (req, res) {
  res.redirect("/login");
});

//login page
router.get("/login", function (req, res) {
  var message = req.query.message || "false";
  res.render("login", { message: message });
});

// Google Authorization
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?message='Login Again!!!'",
  }),
  callbackHandle.callback
);

// callback Success
router.get("/google/callback/success", callbackHandle.callbackSuccess);

// callback failure
router.get(
  "/google/callback/failure",
  token_breaker,
  callbackHandle.callbackFailure
);

//for rendering details.ejs
router.get("/fill_details", check, token_breaker, control.get_details);

//for getting neccessary details
router.post("/fill_details", token_breaker, control.post_details);

// review details
router.get("/review", check, token_breaker, control.review);

router.get("/payment", razorpay.get_payment);
// payment route
router.post("/payment", razorpay.create_orderid);

router.post("/payment/verify", razorpay.verify_payment);

//router export
module.exports = router;
