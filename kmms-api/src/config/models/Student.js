const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: {
    type: Number,
    required: true,
    min: [4, "Student age must be at least 4"],
    max: [6, "Student age must not exceed 6"],
  },
    className: { type: String, required: true }, // e.g., "Nursery A"

    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    parentName: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // role=parent
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // role=teacher
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
