const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. 'announcement','attendance','invoice','payment','sickleave','salary','message'
  title: { type: String, required: true },
  body: { type: String },
  data: { type: mongoose.Schema.Types.Mixed }, // optional extra (ids, urls)
  isRead: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
