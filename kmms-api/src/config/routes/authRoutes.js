const express = require("express");
const router = express.Router();
// Import the controller functions
const { registerUser, loginUser, getMe } = require("../controllers/authController"); 
const { protect } = require("../middleware/authMiddleware");

// Use the controller functions
router.post("/register", registerUser);
router.post("/login", loginUser); // Points to authController.js
router.get("/me", protect, getMe);

module.exports = router;