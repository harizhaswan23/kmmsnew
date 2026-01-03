const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  classAssigned: { type: String, required: true },
  subjects: { type: String, default: "" }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
