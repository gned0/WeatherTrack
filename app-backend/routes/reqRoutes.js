const express = require("express");
const requestController = require("../controllers/requestController");
const router = express.Router();
const { authentication } = require('../middleware/index');

const { verifyToken, isAdmin } = authentication;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new request (requires login)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       '201':
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
router.post("/requests", verifyToken, requestController.createRequest);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests (requires admin role)
 *     description: Retrieve a list of all requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (not an admin)
 *       '500':
 *         description: Internal Server Error
 */
router.get("/requests", verifyToken, isAdmin, requestController.getRequests);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get request by ID (requires login)
 *     description: Retrieve request information by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: Request information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal Server Error
 */
router.get("/requests/:id", verifyToken, requestController.getRequestById);

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update request (requires admin role)
 *     description: Update request information by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       '200':
 *         description: Updated request information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (not an admin)
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal Server Error
 */
router.put("/requests/:id", verifyToken, isAdmin, requestController.updateRequest);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete request (requires admin role)
 *     description: Delete request by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       '200':
 *         description: Request deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (not an admin)
 *       '404':
 *         description: Request not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/requests/:id", verifyToken, isAdmin, requestController.deleteRequest);

/**
 * @swagger
 * /requests/my-requests:
 *   get:
 *     summary: Get all requests made by the user (requires login)
 *     description: Retrieve all requests made by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - requests
 *     responses:
 *       '200':
 *         description: List of requests made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
router.get("/my-requests", verifyToken, requestController.getRequestsByUser);


module.exports = router;