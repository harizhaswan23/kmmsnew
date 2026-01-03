const express = require("express");
const router = express.Router();
const { getTeachers, addTeacher, deleteTeacher } = require("../controllers/teacherController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin","teacher"), getTeachers);
router.post("/", protect, authorize("admin"), addTeacher);
router.delete("/:id", protect, authorize("admin"), deleteTeacher);

module.exports = router;
