const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  baseSalary: { type: Number },
  allowance: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  month: { type: String } // YYYY-MM
}, { timestamps: true });

module.exports = mongoose.model("TeacherSalary", salarySchema);
