const express = require("express");
const router = express.Router();

const {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule
} = require("../controllers/scheduleController");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET all schedules (Admin + Teacher)
router.get("/", protect, authorize("admin", "teacher"), getSchedules);

// CREATE schedule (Admin + Teacher)
router.post("/", protect, authorize("admin", "teacher"), addSchedule);

// UPDATE schedule (Admin + Teacher)
router.put("/:id", protect, authorize("admin", "teacher"), updateSchedule);

// DELETE schedule (Admin only)
router.delete("/:id", protect, authorize("admin"), deleteSchedule);

module.exports = router;
