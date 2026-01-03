const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetRole: { type: String, default: "all" }, // all | teacher | parent
  attachment: { type: String } // URL path
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
