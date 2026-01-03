const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");

// GET all announcements
router.get("/", protect, async (req, res) => {
  const list = await Announcement.find()
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 });
  res.json(list);
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
