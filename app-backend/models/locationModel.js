const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         location_name:
 *           type: string
 *         sensor_identifier:
 *           type: number
 *         coordinates:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             long:
 *               type: number
 *       required:
 *         - location_name
 *         - sensor_identifier
 *         - coordinates
 */
const locationDataSchema = new mongoose.Schema({
  location_name: { type: String, required: true },
  sensor_identifier: { type: Number, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  }
});

const Location = mongoose.model('locations', locationDataSchema, 'locations');

module.exports = Location;
