const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Anomaly:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         attribute:
 *           type: string
 *         value:
 *           type: number
 *       required:
 *         - timestamp
 *         - location
 *         - attribute
 *         - value
 */
const AnomalySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  attribute: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }
});

const Anomaly = mongoose.model('Anomaly', AnomalySchema, 'anomalies');

module.exports = Anomaly;
