const Student = require("../models/Student");
const User = require("../models/User");

// Helper to calculate age
const calculateAge = (dob) => {
  if (!dob) return 0;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// GET students (Preserving your filtering logic)
exports.getStudents = async (req, res, next) => {
  try {
    let query = {};
    // Ensure req.user exists before checking role (middleware handled, but safety check)
    if (req.user && req.user.role === "teacher") query.teacherId = req.user._id;
    if (req.user && req.user.role === "parent") query.parentId = req.user._id;

    const students = await Student.find(query)
      .populate("teacherId", "name email")
      .populate("parentId", "name email") // Populates the linked Parent User
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

// CREATE Student + Parent Account (FIXED)
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

    // 1. Calculate Age (REQUIRED by your Student Model)
    const age = calculateAge(dateOfBirth);

    // 2. Check if parent email exists (if provided)
    if (parentEmail) {
      const existingUser = await User.findOne({ email: parentEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Parent email already exists." });
      }
    }

    // 3. Create Student (Include 'age' to fix Validation Error)
    const newStudent = await Student.create({
      name,
      dateOfBirth,
      age, // <--- Added this line
      gender,
      registrationDate,
      classId,
      parentName,
      teacherId: teacherId || undefined,
      status: status || "active",
    });

    // 4. Create Parent User (if email provided)
    if (parentEmail && parentPassword) {
      const newParent = await User.create({
        name: parentName,
        email: parentEmail,
        password: parentPassword, // Model hashes this automatically
        role: "parent",
        childStudentId: newStudent._id, // Link Parent -> Student
      });

      // 5. Update Student with parentId (Link Student -> Parent)
      newStudent.parentId = newParent._id;
      await newStudent.save();
    }

    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Create Student Error:", err); // Log exact error to console
    next(err);
  }
};

// UPDATE Student
exports.updateStudent = async (req, res, next) => {
  try {
    // Recalculate age if DOB changes
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
    
    // Optional: Delete the parent user too? 
    // Usually kept for records, but you can add User.deleteOne({ _id: student.parentId }) if needed.

    res.json({ message: "Student removed" });
  } catch (err) {
    next(err);
  }
};