const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(100);
  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const n = await Notification.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true }, { new: true });
  if (!n) return res.status(404).json({ message: 'Not found' });
  res.json(n);
};

exports.markAllAsRead = async (req, res) => {
  const userId = req.user.id;
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
  res.json({ success: true });
};

module.exports = exports;
