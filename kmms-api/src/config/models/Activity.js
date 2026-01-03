const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("Activity", activitySchema);
