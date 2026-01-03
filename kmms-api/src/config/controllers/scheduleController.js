const Schedule = require("../models/Schedule");

// ===============================
// GET all schedules
// ===============================
const getSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find()
      .populate("teacherId", "name")
      .populate("classId", "className");

    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

// ===============================
// CREATE schedule
// ===============================
const addSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE schedule
// ===============================
const updateSchedule = async (req, res, next) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ===============================
// DELETE schedule
// ===============================
const deleteSchedule = async (req, res, next) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ message: "Schedule deleted" });
  } catch (err) {
    next(err);
  }
};

// Export clean object
module.exports = {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
};
