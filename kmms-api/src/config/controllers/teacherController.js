const User = require("../models/User");

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("-password");
    res.json(teachers);
  } catch (err) { next(err); }
};

exports.addTeacher = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400); throw new Error("Missing fields"); }
    const exists = await User.findOne({ email });
    if (exists) { res.status(400); throw new Error("User exists"); }
    const t = await User.create({ name, email, password, role: "teacher" });
    res.status(201).json({ _id: t._id, name: t.name, email: t.email, role: t.role });
  } catch (err) { next(err); }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) { next(err); }
};
