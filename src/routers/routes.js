const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../controller/passportAuth");
// const auth = require("../middleware/auth");
// const razorpay = require("../controller/razorpay");
const Team = require("../models/team");
const Transaction = require("../models/transaction");
const secretKey = process.env.secretKey;

//home route
router.get("/", function (req, res) {
  res.redirect("/login");
});

//login page
router.get("/login", function (req, res) {
  res.render("login");
});

// Google Authorization
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data using the access token received
// router.get(
//   "/google/callback",
//   passport.authenticate(
//     "google",
//     {
//       session: false,
//       // successRedirect: "/google/callback/success",
//       failureRedirect: "/google/callback/failure",
//     },
//     (req, res) => {
//       console.log("user again ", req.user);
//     }
//   )
// );

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log(req.user.email);
    const email = req.user.email.split("@");
    if (email[1] === "akgec.ac.in") {
      jwt.sign(
        {
          name: req.user.displayName,
          email: req.user.email,
          profile: req.user.picture,
        },
        secretKey,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            return res.json({
              token: null,
            });
          }
          // res.json({ token: token });
          res.redirect(`/google/callback/success/${token}`);
        }
      );
    } else {
      res.send("Invalid Email!Please login with college email");
    }
  }
);

//Success
router.get("/google/callback/success/:token", googleAuth, async (req, res) => {
  //   if (!req.user) {
  //     res.redirect("/auth/callback/failure");
  //   }
  //   res.send("Welcome " + req.user.email);
});

// failure
router.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});
module.exports = router;
