const mongoose = require("mongoose");

//defining structure
const teamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true,
  },
  leader: {
    name: String,
    email: String,
    student_no: Number,
    profile_img: String,
  },
  team_mate: {
    name: String,
    email: String,
    student_no: Number,
    profile_img: String,
  },
});

//creating collection
const Team = mongoose.model("Teams", teamSchema);

//export
module.exports = Team;
