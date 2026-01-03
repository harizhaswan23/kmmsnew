const Payment = require("../models/Payment");

// GET all payments
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("invoiceId");
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// CREATE payment
exports.createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

// DELETE payment
exports.deletePayment = async (req, res, next) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment deleted" });
  } catch (err) {
    next(err);
  }
};
