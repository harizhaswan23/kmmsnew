const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Storing as "YYYY-MM-DD" is easiest for querying
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    records: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          default: "Present",
        },
        reason: {
          type: String,
          enum: ["Sick", "Family Matter", "Emergency", "MIA", null, ""],
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate attendance sheets for the same class on the same day
attendanceSchema.index({ date: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);