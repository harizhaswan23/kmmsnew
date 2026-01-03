const express = require("express");
const Student = require("../models/Student");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Helper: validate age (4–6 only)
 */
const isValidAge = (age) => Number.isInteger(age) && age >= 4 && age <= 6;

// =============================
// GET /api/students
// =============================
router.get("/", protect, async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "teacher") {
      query.teacherId = req.user._id;
    } else if (req.user.role === "parent") {
      query.parentId = req.user._id;
    }

    const students = await Student.find(query)
      .populate("teacherId", "name email")
      .populate("parentId", "name email");

    res.json(students);
  } catch (err) {
    next(err);
  }
});

// =============================
// POST /api/students
// Admin only
// =============================
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const data = req.body;

    // ✅ BULK INSERT
    if (Array.isArray(data)) {
      for (const s of data) {
        if (!isValidAge(s.age)) {
          return res.status(400).json({
            message: "Student age must be between 4 and 6 years",
          });
        }
      }

      const students = await Student.insertMany(data, {
        runValidators: true, // IMPORTANT
      });

      return res.status(201).json(students);
    }

    // ✅ SINGLE INSERT
    if (!isValidAge(data.age)) {
      return res.status(400).json({
        message: "Student age must be between 4 and 6 years",
      });
    }

    const student = await Student.create(data);
    return res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

// =============================
// PUT /api/students/:id
// Admin only
// =============================
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    // ✅ Validate age if provided
    if (req.body.age !== undefined && !isValidAge(req.body.age)) {
      return res.status(400).json({
        message: "Student age must be between 4 and 6 years",
      });
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // IMPORTANT
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// =============================
// DELETE /api/students/:id
// Admin only
// =============================
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const removed = await Student.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student removed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
