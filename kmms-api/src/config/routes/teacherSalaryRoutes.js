const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const teacherSalaryController = require('../controllers/teacherSalaryController');

router.post('/:salaryId/pay', protect, authorize('admin'), teacherSalaryController.recordPayment);
router.get('/', protect, teacherSalaryController.getMySalaries);

module.exports = router;
