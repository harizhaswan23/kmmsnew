const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  level: { type: String, required: true },
});

module.exports = mongoose.model("Class", classSchema);
