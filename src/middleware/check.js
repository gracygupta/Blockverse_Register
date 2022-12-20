const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

const check = async (req, res, next) => {
  var booleans = req.cookies.variables;
  if (!booleans) {
    console.log("Redirecting to -> /login\n");
    res.redirect("/login?message=Session expire. Please register again!!");
  } else {
    if (booleans.signin_status === "true" && booleans.details === "true") {
      console.log("Redirecting to -> /review\n");
      next();
    } else if (
      booleans.signin_status === "true" &&
      booleans.details === "false"
    ) {
      console.log("Redirecting to -> /fill_details");
      next();
    } else {
      console.log("Redirecting to -> /login\n");
      res.redirect("/login?message=Please Signin...");
    }
  }
};

const check_completion = async (req, res, next) => {
  const payment = req.cookies.payment_status;
  if (!payment) {
    console.log("Redirecting to -> /review\n");
    res.redirect("/review?message=***Please pay registration fee***");
  } else {
    console.log("Redirecting to -> /submit\n");
    next();
  }
};

module.exports = { check, check_completion };
