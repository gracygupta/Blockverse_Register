const express = require("express");
const router = express.Router();
const passport = require("passport");

//middlewares import
const token_breaker = require("../middleware/token_to_body");
const check = require("../middleware/check").check;
const check_completion = require("../middleware/check").check_completion;

//controllers
require("../controller/passportAuth");
const callbackHandle = require("../controller/callbackHandler");
const control = require("../controller/controls");
const razorpay = require("../controller/razorpay");

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
    failureRedirect: "/login?message=Login Again!!!",
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

// review details entered
router.get("/review", check, token_breaker, control.review);

// payment route
router.post("/payment", check, razorpay.create_orderid);

// payment signature verification
router.post("/payment/verify", token_breaker, razorpay.verify_payment);

// submit to end registration
router.get("/submit", check_completion, token_breaker, control.submit);

//router export
module.exports = router;
