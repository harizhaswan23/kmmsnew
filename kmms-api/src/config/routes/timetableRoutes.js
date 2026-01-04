const express = require("express");
const router = express.Router();

const {
  createTimetable,
  getTimetableByClass,
  getTeacherTimetable,
  getParentTimetableToday,
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ADMIN
router.post("/", protect, authorize("admin"), createTimetable);
router.get("/", protect, authorize("admin"), getTimetableByClass);

// TEACHER
router.get("/teacher", protect, authorize("teacher"), getTeacherTimetable);

// PARENT
router.get("/parent/today", protect, authorize("parent"), getParentTimetableToday);

module.exports = router;
