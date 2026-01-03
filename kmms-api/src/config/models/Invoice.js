const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  amount: { type: Number, required: true },
  category: { type: String },
  status: { type: String, enum: ["unpaid","paid","partial"], default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
