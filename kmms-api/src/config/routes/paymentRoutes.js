const express = require("express");
const router = express.Router();

const {
  getPayments,
  createPayment,
  deletePayment
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET all payments (admin + teacher)
router.get("/", protect, authorize("admin", "teacher"), getPayments);

// CREATE payment (admin only)
router.post("/", protect, authorize("admin"), createPayment);

// DELETE payment (admin only)
router.delete("/:id", protect, authorize("admin"), deletePayment);

module.exports = router;
