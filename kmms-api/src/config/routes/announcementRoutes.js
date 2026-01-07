const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");

// GET announcements (Filtered by Role)
router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    // If NOT admin, restrict what they can see
    if (req.user.role !== "admin") {
      // Users see announcements for "all" OR their specific role
      // Example: Teachers see "all" and "teacher"
      query.targetRole = { $in: ["all", req.user.role] };
    }

    const list = await Announcement.find(query)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
});

// ADMIN: Create announcement
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { title, message, targetRole } = req.body;

  const newA = await Announcement.create({
    title,
    message,
    targetRole: targetRole || "all",
    createdBy: req.user._id,
  });

  res.status(201).json(newA);
});

// ADMIN: delete announcement
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Announcement removed" });
});

module.exports = router;