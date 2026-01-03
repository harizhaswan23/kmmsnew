const express = require("express");
const router = express.Router();

const {
  getActivities,
  addActivity,
  deleteActivity
} = require("../controllers/activityController");

const { protect, authorize } = require("../middleware/authMiddleware");

// =============================
// GET /api/activities
// Admin → sees all activities
// Teacher → sees only their students' activities
// Parent → sees only their child's activities
// =============================
router.get("/", protect, authorize("admin", "teacher", "parent"), getActivities);

// =============================
// POST /api/activities
// Teacher only → record activity
// =============================
router.post("/", protect, authorize("teacher"), addActivity);

// =============================
// DELETE /api/activities/:id
// Admin only → delete activity
// =============================
router.delete("/:id", protect, authorize("admin"), deleteActivity);

module.exports = router;
