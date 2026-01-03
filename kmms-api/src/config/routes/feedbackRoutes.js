const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getFeedback,
  addFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");

router.get("/", protect, getFeedback);
router.post("/", protect, addFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
