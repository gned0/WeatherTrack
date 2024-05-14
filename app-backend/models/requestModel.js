const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: objectId
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - approved
 *             - rejected
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - userId
 *         - title
 *         - description
 */
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model("Request", requestSchema, "requests");

module.exports = Request;
