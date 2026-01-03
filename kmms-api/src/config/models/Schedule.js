const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },
    date: {
      type: String, // Example: "2025-01-30"
      required: true
    },
    startTime: {
      type: String, // "09:00"
      required: true
    },
    endTime: {
      type: String, // "10:30"
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
