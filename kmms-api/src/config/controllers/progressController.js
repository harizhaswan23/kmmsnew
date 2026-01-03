const ProgressReport = require("../models/ProgressReport");

// GET all progress reports
exports.getProgressReports = async (req, res, next) => {
  try {
    const reports = await ProgressReport.find()
      .populate("studentId", "name")
      .populate("teacherId", "name");
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// GET report by ID
exports.getProgressReport = async (req, res, next) => {
  try {
    const report = await ProgressReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);
  } catch (err) {
    next(err);
  }
};

// CREATE report
exports.createProgressReport = async (req, res, next) => {
  try {
    const newReport = await ProgressReport.create(req.body);
    res.status(201).json(newReport);
  } catch (err) {
    next(err);
  }
};

// UPDATE report
exports.updateProgressReport = async (req, res, next) => {
  try {
    const updated = await ProgressReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE report
exports.deleteProgressReport = async (req, res, next) => {
  try {
    const deleted = await ProgressReport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted" });
  } catch (err) {
    next(err);
  }
};
