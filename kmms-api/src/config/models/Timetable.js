const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Teacher" depending on your referencing
    },
    // Standardize on "day" to match Frontend
    day: {
      type: String, 
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// --- INDEXING EXPLAINED ---
// We want to prevent DOUBLE BOOKING (Two classes at the same time for the same group).
// So, Class + Day + StartTime must be unique.
timetableSchema.index({ classId: 1, day: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);