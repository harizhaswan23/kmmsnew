const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const sickLeaveController = require('../controllers/sickLeaveController');

router.post('/', protect, authorize('teacher'), sickLeaveController.submitSickLeave);
router.post('/:id/review', protect, authorize('admin'), sickLeaveController.reviewSickLeave);

module.exports = router;
