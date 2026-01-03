const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackType: {
      type: String,
      enum: ["teacher", "child", "general"],
      required: true
    },
    category: String,
    comments: String,
    strengths: String,
    improvementAreas: String,
    attachmentUrl: String,

    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    feedbackDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
