const Message = require("../models/Message");
const { createNotification } = require("../../utils/notificationHelper");
const User = require("../models/User");

// GET messages (optional filter)
const getMessages = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.query;

    const filter = {};
    if (senderId) filter.senderId = senderId;
    if (receiverId) filter.receiverId = receiverId;

    const messages = await Message.find(filter)
      .populate("senderId", "name role")
      .populate("receiverId", "name role")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// GET single message
const getMessage = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id)
      .populate("senderId", "name role")
      .populate("receiverId", "name role");

    if (!msg) return res.status(404).json({ message: "Message not found" });

    res.json(msg);
  } catch (err) {
    next(err);
  }
};

// CREATE message (fixed)
const createMessage = async (req, res, next) => {
  try {
    // Save message
    const msg = await Message.create(req.body);

    // Fetch sender details
    const sender = await User.findById(msg.senderId);

    // Create notification for receiver (MSG1)
    await createNotification({
      recipientId: msg.receiverId,
      type: "message",
      title: `New message from ${sender?.name || "Someone"}`,
      body: msg.text?.slice(0, 200) || "",
      data: { messageId: msg._id },
      createdBy: msg.senderId,
    });

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

// DELETE message
const deleteMessage = async (req, res, next) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
};
