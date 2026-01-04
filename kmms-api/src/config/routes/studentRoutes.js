const express = require("express");
const Student = require("../models/Student");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();



/**
 * Helper: calculate age from date of birth
 */
const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Helper: remove empty string values
 */
const sanitize = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === "") {
      delete obj[key];
    }
  });
};

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
    .populate("classId", "className yearGroup")
    .populate("teacherId", "name email")
    .populate("parentId", "name email");


    res.json(students);
  } catch (err) {
    next(err);
  }
});

// =============================
// POST /api/students (Admin)
// =============================
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    let data = req.body;

    // ✅ BULK INSERT
    if (Array.isArray(data)) {
      for (const s of data) {
        sanitize(s);

        if (!s.dateOfBirth) {
          return res.status(400).json({
            message: "dateOfBirth is required",
          });
        }

        s.age = calculateAge(s.dateOfBirth);

      }

      const students = await Student.insertMany(data, {
        runValidators: true,
      });

      return res.status(201).json(students);
    }

    // ✅ SINGLE INSERT
    sanitize(data);

    if (!data.dateOfBirth) {
      return res.status(400).json({
        message: "dateOfBirth is required",
      });
    }

    data.age = calculateAge(data.dateOfBirth);


    const student = await Student.create(data);
    return res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

// =============================
// PUT /api/students/:id (Admin)
// =============================
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    sanitize(req.body);

    if (req.body.dateOfBirth) {
      req.body.age = calculateAge(req.body.dateOfBirth);

        // no age restriction

    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
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
