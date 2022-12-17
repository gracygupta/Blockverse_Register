const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

const check = async (req, res, next) => {
  var booleans = req.cookies.variables;
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
    res.redirect("/login?message=Please Signin...");
    // res.json({ message: "Please Signin..." });
  }
};

module.exports = check;
