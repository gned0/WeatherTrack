const express = require("express");
const notificationController = require("../controllers/notificationController");
const { authentication } = require('../middleware/index');
const router = express.Router();

const { verifyToken, isAdmin } = authentication;
/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       '200':
 *         description: Notification created successfully
 *       '500':
 *         description: Server error
 */
router.post("/notifications", verifyToken, notificationController.create);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications
 *     responses:
 *       '200':
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       '500':
 *         description: Server error
 */
router.get("/notifications", verifyToken, notificationController.findAll);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: Notification ID
 *     responses:
 *       '200':
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       '404':
 *         description: Notification not found
 *       '500':
 *         description: Server error
 */
router.get("/notifications/:id", verifyToken, notificationController.findOne);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       '200':
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       '404':
 *         description: Notification not found
 *       '500':
 *         description: Server error
 */
router.put("/notifications/:id", verifyToken, notificationController.update);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: objectid
 *         required: true
 *         description: Notification ID
 *     responses:
 *       '200':
 *         description: Notification deleted successfully
 *       '404':
 *         description: Notification not found
 *       '500':
 *         description: Server error
 */
router.delete("/notifications/:id", verifyToken, notificationController.delete);

module.exports = router;
