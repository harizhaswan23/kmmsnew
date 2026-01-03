const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
  leaveId: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherSickLeave" },
  substituteTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("SubstituteAssignment", subSchema);
