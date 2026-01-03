const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String }, // YYYY-MM-DD
  time: { type: String },
  activity: { type: String },
  notes: { type: String },
  photoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("DailyActivity", activitySchema);
