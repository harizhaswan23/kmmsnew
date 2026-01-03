const TeacherSalary = require('../models/TeacherSalary'); // you said this exists
const { createNotification } = require('../utils/notificationHelper');

// endpoint to record payment
exports.recordPayment = async (req, res) => {
  const { salaryId } = req.params;
  const { paidAt, paidBy } = req.body; // admin triggers
  const salary = await TeacherSalary.findById(salaryId);
  if (!salary) return res.status(404).json({ message: 'Salary not found' });
  salary.status = 'paid';
  salary.paidAt = paidAt || new Date();
  salary.paidBy = req.user.id;
  await salary.save();

  // notify teacher when salary is paid (SAL-N2)
  await createNotification({
    recipientId: salary.teacher,
    type: 'salary',
    title: 'Salary paid',
    body: `Salary for ${salary.month} ${salary.year} has been paid.`,
    data: { salaryId: salary._id },
    createdBy: req.user.id
  });

  res.json(salary);
};

// utility used by cron to auto-create salary rows
exports.createSalaryRecord = async ({ teacherId, amount, month, year }) => {
  const exists = await TeacherSalary.findOne({ teacher: teacherId, month, year });
  if (exists) return exists;
  const s = new TeacherSalary({ teacher: teacherId, amount, month, year, status: 'unpaid' });
  await s.save();
  return s;
};

// optional: endpoint to list salaries for teacher
exports.getMySalaries = async (req, res) => {
  const teacherId = req.user.role === 'teacher' ? req.user.id : req.query.teacherId;
  const salaries = await TeacherSalary.find({ teacher: teacherId }).sort({ year: -1, month: -1 });
  res.json(salaries);
};

module.exports = exports;
