const jwt = require("jsonwebtoken");
const { post } = require("../routers/routes");

const secretKey = process.env.secretKey;
const expireTime = 1000 * 60 * 60;
const oneDay = 1000 * 60 * 60 * 24;

// update cookie -> Information
const updateData = function (
  team,
  lname,
  lemail,
  lprofile,
  lstud_no,
  tname,
  temail,
  tprofile,
  tstud_no
) {
  const token = jwt.sign(
    {
      team_name: team,
      lname: lname,
      lemail: lemail,
      lprofile: lprofile,
      lstud_no: lstud_no,
      tname: tname,
      temail: temail,
      tprofile: tprofile,
      tstud_no: tstud_no,
    },
    secretKey
  );
  return token;
};

// get.fill_detail handler
const get_details = async (req, res) => {
  console.log(req.body);
  var message = req.query.message || "false";
  res.render("details", {
    message: message,
    lname: req.body.lname,
    lemail: req.body.lemail,
  });
};

// post.fill_details handler
const post_details = async (req, res) => {
  const email = req.body.temail.split("@");
  console.log(req.body);
  if (email[1] != "akgec.ac.in") {
    res.redirect("/fill_details?message=*** Enter College Email Only ***");
  } else {
    let rb = req.body;
    token = updateData(
      rb.team_name,
      rb.lname,
      rb.lemail,
      rb.lprofile,
      rb.lstud_no,
      rb.tname,
      rb.temail,
      rb.tprofile,
      rb.tstud_no
    );
    // updating Information cookie
    res.cookie("Information", token, {
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
      secure: false,
      overwrite: true,
    });

    // updating variables cookie
    const boolean = {
      signin_status: "true",
      details: "true",
      payment_status: "false",
    };
    res.cookie("variables", boolean, {
      expires: new Date(Date.now() + expireTime),
      httpOnly: true,
      secure: false,
      overwrite: true,
    });
    res.redirect("/review");
  }
};

// get.review handler
const review = async (req, res) => {
  console.log(req.body);
  res.render("review", {
    team_name: req.body.team_name,
    lprofile: req.body.lprofile,
    leader_name: req.body.lname,
    leader_email: req.body.lemail,
    leader_studno: req.body.lstud_no,
    teammate_name: req.body.tname,
    teammate_email: req.body.temail,
    teammate_studno: req.body.tstud_no,
  });
};

// exporting handlers
module.exports = { get_details, post_details, review };
