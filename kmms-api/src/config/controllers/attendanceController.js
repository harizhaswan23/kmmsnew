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



// GET Monthly Stats for a Class
exports.getMonthlyStats = async (req, res, next) => {
  try {
    const { classId, month } = req.query; // month format: "YYYY-MM"

    if (!classId || !month) {
      return res.status(400).json({ message: "Class ID and Month are required" });
    }

    // Find all attendance documents for this class that start with "YYYY-MM"
    // Since date is stored as "YYYY-MM-DD", we can use Regex
    const attendanceList = await Attendance.find({
      classId: classId,
      date: { $regex: `^${month}` } // Starts with "2026-01"
    });

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalRecords = 0;

    // Loop through every day found
    attendanceList.forEach((day) => {
      day.records.forEach((student) => {
        totalRecords++;
        if (student.status === "Present") {
          totalPresent++;
        } else {
          totalAbsent++;
        }
      });
    });

    // Calculate Percentage
    const percentage = totalRecords === 0 ? 0 : Math.round((totalPresent / totalRecords) * 100);

    res.json({
      month,
      classId,
      totalDays: attendanceList.length,
      totalRecords,
      totalPresent,
      totalAbsent,
      percentage
    });

  } catch (err) {
    next(err);
  }
};