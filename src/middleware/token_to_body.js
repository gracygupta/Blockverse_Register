const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

const breakToken = (req, res, next) => {
  try {
    let token = req.cookies.Information;
    let boolean = req.cookies.variables;
    if (token) {
      let user = jwt.verify(token, secretKey);
      if (user) {
        req.body.lemail = user.lemail;
        req.body.lname = user.lname;
        req.body.lprofile = user.lprofile;
        if (boolean.details === "true") {
          req.body.team_name = user.team_name;
          req.body.lstud_no = user.lstud_no;
          req.body.tname = user.tname;
          req.body.temail = user.temail;
          req.body.tprofile = user.tprofile;
          req.body.tstud_no = user.tstud_no;
        }
        next();
      }
    } else {
      const message = "Token expire, please Login Again";
      console.log("Token expire...");
      console.log("Redirecting to -> /login\n");
      res.redirect(`/login?message=${message}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = breakToken;
