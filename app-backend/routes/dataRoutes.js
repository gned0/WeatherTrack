const express = require("express");
const dataController = require("../controllers/dataController");
const { authentication } = require('../middleware/index');

const router = express.Router();

const { verifyToken, isAdmin } = authentication;

/**
 * @swagger
 * /data/latest:
 *   get:
 *     summary: Get latest data
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location
 *       - in: query
 *         name: attribute
 *         schema:
 *           type: string
 *         required: false
 *         description: Attribute name
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       '400':
 *         description: Missing required query parameter
 *       '404':
 *         description: No data found for the specified location
 *       '500':
 *         description: Server error
 */
router.get("/data/latest", dataController.getLatestData);

/**
 * @swagger
 * /data/max:
 *   get:
 *     summary: Get max data in timespan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location
 *       - in: query
 *         name: attribute
 *         schema:
 *           type: string
 *         required: false
 *         description: Attribute name
 *       - in: query
 *         name: timespan
 *         schema:
 *           type: number
 *         required: false
 *         description: Timespan in hours
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       '400':
 *         description: Missing required query parameter
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No data found for the specified location and timespan
 *       '500':
 *         description: Server error
 */
router.get("/data/max", verifyToken, dataController.getMaxDataInTimespan);

/**
 * @swagger
 * /data/avg:
 *   get:
 *     summary: Get average data in timespan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location
 *       - in: query
 *         name: attribute
 *         schema:
 *           type: string
 *         required: false
 *         description: Attribute name
 *       - in: query
 *         name: timespan
 *         schema:
 *           type: number
 *         required: false
 *         description: Timespan in hours
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: object
 *                 timespan:
 *                   type: object
 *       '400':
 *         description: Missing required query parameter
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No data found for the specified location and timespan
 *       '500':
 *         description: Server error
 */
router.get("/data/avg", verifyToken, dataController.getAvgDataInTimespan);

/**
 * @swagger
 * /data/min:
 *   get:
 *     summary: Get minimum data in timespan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location
 *       - in: query
 *         name: attribute
 *         schema:
 *           type: string
 *         required: false
 *         description: Attribute name
 *       - in: query
 *         name: timespan
 *         schema:
 *           type: number
 *         required: false
 *         description: Timespan in hours
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       '400':
 *         description: Missing required query parameter
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No data found for the specified location and timespan
 *       '500':
 *         description: Server error
 */
router.get("/data/min", verifyToken, dataController.getMinDataInTimespan);

/**
 * @swagger
 * /data:
 *   post:
 *     summary: Create new data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Data'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Data'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Server error
 */
router.post("/data", verifyToken, isAdmin, dataController.createData);

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all locations
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       '500':
 *         description: Server error
 */
router.get("/locations", dataController.getLocations);

/** 
 * @swagger
 * /data/span:
 *   get:
 *     summary: Get data in timespan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location
 *       - in: query
 *         name: hours
 *         schema:
 *           type: number
 *         required: true
 *         description: Timespan in hours
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Data'
 *       '400':
 *         description: Missing required query parameter
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: No data found for the specified location and timespan
 *       '500':
 *         description: Server error
 */
router.get("/data/span", verifyToken, dataController.getDataInTimespan);

/**
 * @swagger
 * /anomalies:
 *   get:
 *     summary: Get anomalies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Anomaly'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 *
 */
router.get("/anomalies", dataController.getAnomalies);

router.get("/coordinates", verifyToken, dataController.getAllCoordinates)

module.exports = router;
