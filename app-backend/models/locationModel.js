const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         latitude:
 *          type: number
 *         longitude:
 *          type: number
 *       required:
 *         - location_name
 *         - sensor_identifier
 *         - coordinates
 */
const locationDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Location = mongoose.model('locations', locationDataSchema, 'locations');

module.exports = Location;
