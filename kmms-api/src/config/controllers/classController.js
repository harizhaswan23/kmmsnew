const Class = require("../models/Class");

// GET all classes
exports.getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

// GET single class
exports.getClass = async (req, res, next) => {
  try {
    const c = await Class.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Class not found" });

    res.json(c);
  } catch (err) {
    next(err);
  }
};

// CREATE class
exports.createClass = async (req, res, next) => {
  try {
    const { className, level } = req.body;

    const newClass = await Class.create({
      className,
      level,
    });

    res.status(201).json(newClass);
  } catch (err) {
    next(err);
  }
};

// UPDATE class
exports.updateClass = async (req, res, next) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Class not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE class
exports.deleteClass = async (req, res, next) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Class not found" });

    res.json({ message: "Class deleted" });
  } catch (err) {
    next(err);
  }
};
