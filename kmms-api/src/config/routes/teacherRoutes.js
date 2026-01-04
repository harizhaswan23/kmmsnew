const express = require("express");
const router = express.Router();

const {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), (req, res, next) => {
  console.log("USER ROLE:", req.user.role);
  next();
}, getTeachers);
router.post("/", protect, authorize("admin"), createTeacher);
router.put("/:id", protect, authorize("admin"), updateTeacher);
router.delete("/:id", protect, authorize("admin"), deleteTeacher);

module.exports = router;
