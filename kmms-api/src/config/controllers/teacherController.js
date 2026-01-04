const User = require("../models/User");

// GET all teachers
exports.getTeachers = async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("-password");
  res.json(teachers);
};

// ADD teacher
exports.createTeacher = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    classAssigned,
    qualification,
    hireDate,
    epfNo,
    taxNo,
    status,
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const teacher = await User.create({
    name,
    email,
    password,
    role: "teacher",
    phone,
    classAssigned,
    qualification,
    hireDate,
    epfNo,
    taxNo,
    status,
  });

  res.status(201).json(teacher);
};

// UPDATE teacher
exports.updateTeacher = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updated) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.json(updated);
};

// DELETE teacher
exports.deleteTeacher = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Teacher removed" });
};
