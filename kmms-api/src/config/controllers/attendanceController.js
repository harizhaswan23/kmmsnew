const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// GET Attendance for a specific Date and Class
exports.getAttendance = async (req, res, next) => {
  try {
    const { date, classId } = req.query;

    if (!date || !classId) {
      return res.status(400).json({ message: "Date and Class ID are required" });
    }

    // 1. Try to find an existing attendance record
    let attendance = await Attendance.findOne({ date, classId }).populate("records.studentId", "name");

    // 2. If NO record exists, we return a "template" based on current students
    if (!attendance) {
      const students = await Student.find({ classId, status: "active" }).select("name _id");
      
      // Return a temporary structure (not saved to DB yet)
      return res.json({
        date,
        classId,
        records: students.map(s => ({
          studentId: s, // Populate structure
          status: "Present",
          reason: ""
        })),
        isNew: true // Flag for frontend
      });
    }

    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

// SAVE / UPDATE Attendance
exports.saveAttendance = async (req, res, next) => {
  try {
    const { date, classId, records } = req.body;

    // Upsert: Update if exists, Insert if new
    const attendance = await Attendance.findOneAndUpdate(
      { date, classId },
      { records },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(attendance);
  } catch (err) {
    next(err);
  }
};