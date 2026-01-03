const Attendance = require("../models/Attendance");

// GET attendance for a specific date or student
exports.getAttendance = async (req, res) => {
  try {
    const { date, studentId } = req.query;

    const query = {};
    if (date) query.date = date;
    if (studentId) query.studentId = studentId;

    const records = await Attendance.find(query);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

// MARK attendance
exports.markAttendance = async (req, res) => {
  try {
    const { date, studentId, status, reason, time } = req.body;

    if (!date || !studentId || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // update if already exists
    const existing = await Attendance.findOne({ date, studentId });

    if (existing) {
      existing.status = status;
      existing.time = time || existing.time;
      existing.reason = reason || existing.reason;
      await existing.save();
      return res.json(existing);
    }

    // create new
    const record = new Attendance({
      date,
      studentId,
      status,
      time,
      reason
    });

    const saved = await record.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: "Error marking attendance" });
  }
};
