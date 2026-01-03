// src/config/routes/messageRoutes.js
const express = require("express");
const router = express.Router();

const {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
} = require("../controllers/messageController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Get messages (user's inbox) - all authenticated users
router.get("/", protect, getMessages);

// Get single message (owner)
router.get("/:id", protect, getMessage);

// Send message (authenticated user)
router.post("/", protect, createMessage);

// Delete message (admin or owner) - controller should check ownership
router.delete("/:id", protect, deleteMessage);

module.exports = router;
