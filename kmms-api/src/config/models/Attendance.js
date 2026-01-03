const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String, required: true }, // YYYY-MM-DD for easy queries
  status: { type: String, enum: ["present","absent","late","excused"], default: "present" },
  notes: { type: String }
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance", attendanceSchema);
