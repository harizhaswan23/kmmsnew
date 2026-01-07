const express = require("express");
const router = express.Router();
const { getAttendance, saveAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAttendance);
router.post("/", protect, saveAttendance);

module.exports = router;