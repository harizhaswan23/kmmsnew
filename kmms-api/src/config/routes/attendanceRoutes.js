const express = require("express");
const router = express.Router();

const {
  getAttendance,
  markAttendance
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

// =============================
// GET /api/attendance
// Admin: get all attendance
// Teacher: get only their class attendance
// Parent: not allowed here (parent sees child attendance in a different endpoint)
// =============================
router.get("/", protect, authorize("admin", "teacher"), getAttendance);

// =============================
// POST /api/attendance
// Teacher only → mark attendance
// =============================
router.post("/", protect, authorize("teacher"), markAttendance);

module.exports = router;
