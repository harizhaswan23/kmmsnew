// src/config/routes/progressRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProgressReports,
  getProgressReport,
  createProgressReport,
  updateProgressReport,
  deleteProgressReport,
} = require("../controllers/progressController");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET all progress reports
// Admin/Teacher can see all, Parent can see their child's reports (controller should filter)
router.get("/", protect, authorize("admin", "teacher", "parent"), getProgressReports);

// GET one report
router.get("/:id", protect, authorize("admin", "teacher", "parent"), getProgressReport);

// Teacher/Admin create report
router.post("/", protect, authorize("admin", "teacher"), createProgressReport);

// Update report (teacher/admin)
router.put("/:id", protect, authorize("admin", "teacher"), updateProgressReport);

// Delete report (admin)
router.delete("/:id", protect, authorize("admin"), deleteProgressReport);

module.exports = router;
