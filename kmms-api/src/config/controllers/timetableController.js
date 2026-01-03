const Timetable = require("../models/Timetable");

// GET /api/timetables?classId=&dayOfWeek=
const getTimetables = async (req, res, next) => {
  try {
    const { classId, dayOfWeek } = req.query;
    const filter = {};

    if (classId) filter.classId = classId;
    if (dayOfWeek) filter.dayOfWeek = dayOfWeek.toLowerCase();

    const docs = await Timetable.find(filter)
      .populate("classId", "name level")
      .sort({ dayOfWeek: 1 });

    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// GET /api/timetables/:id
const getTimetableById = async (req, res, next) => {
  try {
    const doc = await Timetable.findById(req.params.id).populate(
      "classId",
      "name level"
    );
    if (!doc) return res.status(404).json({ message: "Timetable not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// POST /api/timetables
// body: { classId, dayOfWeek, slots: [...] }
const createTimetable = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      dayOfWeek: req.body.dayOfWeek.toLowerCase(),
      createdBy: req.user?._id,
    };

    const doc = await Timetable.create(payload);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// PUT /api/timetables/:id
const updateTimetable = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      updatedBy: req.user?._id,
    };

    if (payload.dayOfWeek) {
      payload.dayOfWeek = payload.dayOfWeek.toLowerCase();
    }

    const doc = await Timetable.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!doc) return res.status(404).json({ message: "Timetable not found" });

    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/timetables/:id
const deleteTimetable = async (req, res, next) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Timetable not found" });

    res.json({ message: "Timetable deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
};
