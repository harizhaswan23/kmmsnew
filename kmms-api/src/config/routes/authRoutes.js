const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// MERGE ALL IMPORTS INTO ONE LINE HERE:
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updatePassword 
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

// Update Password Route
router.put("/update-password", protect, updatePassword);

module.exports = router;