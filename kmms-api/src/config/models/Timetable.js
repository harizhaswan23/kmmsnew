const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },   // e.g. "10:00"
    subject: { type: String, required: true },
    teacherName: { type: String },               // simple for now
    room: { type: String },
    note: { type: String },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    slots: [slotSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// One document per class + day
timetableSchema.index({ classId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);
