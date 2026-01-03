const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialization: { type: String },
  phone: { type: String },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("TeacherProfile", teacherSchema);
