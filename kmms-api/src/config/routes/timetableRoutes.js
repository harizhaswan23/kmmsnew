const express = require("express");
const router = express.Router();

const {
  getTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Everyone logged in can view timetables
router.get("/", protect, getTimetables);
router.get("/:id", protect, getTimetableById);

// Only admin can create / update / delete for now
router.post("/", protect, authorize("admin"), createTimetable);
router.put("/:id", protect, authorize("admin"), updateTimetable);
router.delete("/:id", protect, authorize("admin"), deleteTimetable);

module.exports = router;
