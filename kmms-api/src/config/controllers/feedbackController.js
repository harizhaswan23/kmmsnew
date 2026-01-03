const Feedback = require("../models/Feedback");

exports.getFeedback = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "parent") filter.parentId = req.user._id;
    if (req.user.role === "teacher") filter.teacherId = req.user._id;

    const items = await Feedback.find(filter)
      .populate("studentId", "name")
      .populate("teacherId", "name")
      .populate("parentId", "name");

    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.addFeedback = async (req, res, next) => {
  try {
    const data = await Feedback.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Feedback not found" });

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    next(err);
  }
};
