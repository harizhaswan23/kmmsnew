const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    age: {
      type: Number,
      required: true,
    },

    // 🆕 Date of Birth (Admin must input)
    dateOfBirth: {
      type: Date,
      required: true,
    },

    // 🆕 Gender (Admin must select)
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    className: {
      type: String,
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    parentName: {
      type: String,
      required: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // role=parent
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // role=teacher
    },

    // 🆕 Registration Date (Admin selects)
    registrationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt still useful
  }
);

module.exports = mongoose.model("Student", studentSchema);
