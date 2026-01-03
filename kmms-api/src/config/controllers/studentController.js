const Student = require("../models/Student");

exports.getStudents = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "teacher") query.teacherId = req.user._id;
    if (req.user.role === "parent") query.parentId = req.user._id;

    const students = await Student.find(query)
      .populate("teacherId", "name email")
      .populate("parentId", "name email")
      .populate("classId", "className level");

    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const s = await Student.findById(req.params.id)
      .populate("teacherId", "name")
      .populate("parentId", "name")
      .populate("classId", "className");
    if (!s) { res.status(404); throw new Error("Student not found"); }
    res.json(s);
  } catch (err) { next(err); }
};

exports.createStudent = async (req, res, next) => {
  try {
    const data = req.body;
    if (Array.isArray(data)) {
      const students = await Student.insertMany(data);
      return res.status(201).json(students);
    }
    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (err) { next(err); }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) { res.status(404); throw new Error("Student not found"); }
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student removed" });
  } catch (err) { next(err); }
};
