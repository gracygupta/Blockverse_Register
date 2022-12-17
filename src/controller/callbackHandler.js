const jwt = require("jsonwebtoken");

const secretKey = process.env.secretKey;
const expireTime = 1000 * 60 * 60;
const oneDay = 1000 * 60 * 60 * 24;

// details passed using cookies and jwt token
const createToken = function (name, email, picture) {
  const token = jwt.sign(
    {
      team_name: null,
      lname: name,
      lemail: email,
      lprofile: picture,
      lstud_no: null,
      tname: null,
      temail: null,
      tprofile: null,
      tstud_no: null,
    },
    secretKey
  );
  return token;
};

// callback handler
const callback = async (req, res) => {
  const email = req.user.email.split("@");
  if (email[1] === "akgec.ac.in") {
    token = createToken(req.user.displayName, req.user.email, req.user.picture);
    res.cookie("Information", token, {
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
      secure: false,
      overwrite: true,
    });
    res.redirect("/google/callback/success");
  } else {
    res.redirect("/google/callback/failure");
  }
};

// callback Success
const callbackSuccess = async (req, res) => {
  const boolean = {
    signin_status: "true",
    details: "false",
    payment_status: "false",
  };
  res.cookie("variables", boolean, {
    expires: new Date(Date.now() + expireTime),
    httpOnly: true,
    secure: false,
    overwrite: true,
  });
  res.redirect("/fill_details");
};

//callback Failure
const callbackFailure = async (req, res) => {
  res.redirect(
    "/login?message='Invalid Email!! Please login with college email'"
  );
};

module.exports = { callback, callbackSuccess, callbackFailure };
