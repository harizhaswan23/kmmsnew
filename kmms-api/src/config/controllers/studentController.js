const Student = require("../models/Student");
const User = require("../models/User");

// Helper to calculate age
const calculateAge = (dob) => {
  if (!dob) return 0;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// GET students
exports.getStudents = async (req, res, next) => {
  try {
    let query = {};
    if (req.user && req.user.role === "teacher") query.teacherId = req.user._id;
    if (req.user && req.user.role === "parent") query.parentId = req.user._id;

    const students = await Student.find(query)
      .populate("teacherId", "name email")
      .populate("parentId", "name email")
      .populate("classId", "className level");

    res.json(students);
  } catch (err) {
    next(err);
  }
};

// GET single student
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("teacherId", "name")
      .populate("parentId", "name")
      .populate("classId", "className");
    
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// CREATE Student + Parent Account
exports.createStudent = async (req, res, next) => {
  try {
    const {
      name,
      dateOfBirth,
      gender,
      registrationDate,
      classId,
      parentName,
      parentEmail,
      parentPassword,
      teacherId,
      status,
    } = req.body;

    // 1. Calculate Age
    const age = calculateAge(dateOfBirth);

    // 2. Sanitize Parent Credentials (TRIM SPACES)
    const sanitizedEmail = parentEmail ? parentEmail.trim().toLowerCase() : "";
    const sanitizedPassword = parentPassword ? parentPassword.trim() : "";

    // 3. Check if parent email exists
    if (sanitizedEmail) {
      const existingUser = await User.findOne({ email: sanitizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Parent email already exists." });
      }
    }

    // 4. Create Student
    const newStudent = await Student.create({
      name,
      dateOfBirth,
      age,
      gender,
      registrationDate,
      classId,
      parentName,
      teacherId: teacherId || undefined,
      status: status || "active",
    });

    // 5. Create Parent User (With Sanitized Data)
    if (sanitizedEmail && sanitizedPassword) {
      const newParent = await User.create({
        name: parentName,
        email: sanitizedEmail,
        password: sanitizedPassword, // This triggers the hash hook in User model
        role: "parent",
        childStudentId: newStudent._id,
      });

      // Link Student -> Parent
      newStudent.parentId = newParent._id;
      await newStudent.save();
    }

    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Create Student Error:", err);
    next(err);
  }
};

// UPDATE Student
exports.updateStudent = async (req, res, next) => {
  try {
    if (req.body.dateOfBirth) {
      req.body.age = calculateAge(req.body.dateOfBirth);
    }
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE Student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student removed" });
  } catch (err) {
    next(err);
  }
};