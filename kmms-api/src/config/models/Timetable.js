const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    startTime: {
      type: String, // "08:00"
      required: true,
    },

    endTime: {
      type: String, // "09:00"
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    color: {
      type: String, // hex color
      default: "#60a5fa",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
