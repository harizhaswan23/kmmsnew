const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  date: { type: String },
  timeSlot: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("TeacherSchedule", scheduleSchema);
