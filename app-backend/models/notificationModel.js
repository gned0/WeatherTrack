const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  attribute: {
    type: String,
    required: true,
  },
  operand: {
    type: String,
    enum: ["gt", "lt"],
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', NotificationSchema, 'notifications');

module.exports = Notification;
