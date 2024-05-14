const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorData:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *           required: true
 *         location:
 *           type: string
 *           required: true
 *         sensor_identifier:
 *           type: string
 *           required: true
 *         temperature:
 *           type: number
 *         humidity:
 *           type: number
 *         wind_speed:
 *           type: number
 *         condition:
 *           type: string
 */

const sensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  location: { type: String, required: true },
  sensor_identifier: { type: String, required: true },
  temperature: { type: Number, required: false },
  humidity: { type: Number, required: false },
  wind_speed: { type: Number, required: false },
  condition: { type: String, required: false }
});

const SensorData = mongoose.model('dataPoints', sensorDataSchema, 'dataPoints');

module.exports = SensorData;