const express = require("express");
const router = express.Router();

const {
  createTimetable,
  getTimetableByClass,
  getTeacherTimetable,
  getParentTimetableToday,
  deleteTimetable,
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ADMIN
router.post("/", protect, authorize("admin"), createTimetable);
router.get("/", protect, authorize("admin"), getTimetableByClass);
router.delete("/:id", protect, authorize("admin"), deleteTimetable);

// TEACHER
router.get("/teacher", protect, authorize("teacher"), getTeacherTimetable);

// PARENT
router.get("/parent/today", protect, authorize("parent"), getParentTimetableToday);

module.exports = router;
