const jwt = require("jsonwebtoken");
require("dotenv").config();
const Team = require("../models/team");

const secretKey = process.env.secretKey;
const expireTime = 1000 * 60 * 60;
const oneDay = 1000 * 60 * 60 * 24;
const key_id = process.env.razorpay_key_id;

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
  var message = req.query.message || "false";
  res.render("details", {
    message: message,
    lname: req.body.lname,
    lemail: req.body.lemail,
  });
};

// post.fill_details handler
const post_details = async (req, res) => {
  if (req.body.temail) {
    const email = req.body.temail.split("@");
    if (email[1] != "akgec.ac.in") {
      res.redirect("/fill_details?message=*** Enter College Email Only ***");
    }
  }
  const team = await Team.findOne({ "leader.email": req.body.lemail });
  if (team) {
    return res.redirect("/submit");
  }
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
};

// get.review handler
const review = async (req, res) => {
  var tname = req.body.tnam || "none";
  var temail = req.body.temail || "none";
  var tstud_no = req.body.tstud_no || "none";
  const message = req.query.message || "";
  res.render("review", {
    message: message,
    razorpay_key: key_id,
    team_name: req.body.team_name,
    lprofile: req.body.lprofile,
    leader_name: req.body.lname,
    leader_email: req.body.lemail,
    leader_studno: req.body.lstud_no,
    teammate_name: tname,
    teammate_email: temail,
    teammate_studno: tstud_no,
  });
};

// submit to end registration and store details in server
const submit = async (req, res) => {
  try {
    if (req.body.temail) {
      await Team.create({
        team_name: req.body.team_name,
        leader: {
          email: req.body.lemail,
          name: req.body.lname,
          student_no: req.body.lstud_no,
          profile_img: req.body.lprofile,
        },
        team_mate: {
          email: req.body.temail,
          name: req.body.tname,
          student_no: req.body.tstud_no,
          tprofile: req.body.tprofile,
        },
      });
    } else {
      await Team.create({
        team_name: req.body.team_name,
        leader: {
          email: req.body.lemail,
          name: req.body.lname,
          student_no: req.body.lstud_no,
          profile_img: req.body.lprofile,
        },
      });
    }
    res.render("submit", { message: "" });
  } catch (e) {
    console.log("error");
    res.render("submit", { message: "Already registered for the event" });
  }
};

// exporting handlers
module.exports = { get_details, post_details, review, submit };
