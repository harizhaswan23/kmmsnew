const Activity = require("../models/Activity");

// GET activities (filter by student or date)
exports.getActivities = async (req, res) => {
  try {
    const { studentId, date } = req.query;

    const query = {};
    if (studentId) query.studentId = studentId;
    if (date) query.date = date;

    const activities = await Activity.find(query);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};

// ADD a new activity
exports.addActivity = async (req, res) => {
  try {
    const { studentId, activity, notes, date, time } = req.body;

    if (!studentId || !activity || !date || !time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newAct = new Activity({
      studentId,
      activity,
      notes,
      date,
      time,
      photos: []
    });

    const saved = await newAct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding activity" });
  }
};

// DELETE activity
exports.deleteActivity = async (req, res) => {
  try {
    const act = await Activity.findById(req.params.id);
    if (!act) return res.status(404).json({ message: "Activity not found" });

    await act.deleteOne();
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity" });
  }
};
