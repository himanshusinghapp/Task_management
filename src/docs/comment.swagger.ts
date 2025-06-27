/**
 * @swagger
 * tags:
 *   - name: Comment
 *     description: Comment management for tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentCreate:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *           example: 67890
 *         content:
 *           type: string
 *           example: "This task needs additional resources to complete on time."
 *       required:
 *         - taskId
 *         - content
 *     CommentUpdate:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           example: "Updated: Task requires urgent attention."
 *       required:
 *         - content
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /comments/:
 *   post:
 *     summary: Add a new comment to a task
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentCreate'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 54321
 *                 taskId:
 *                   type: string
 *                   example: 67890
 *                 content:
 *                   type: string
 *                   example: "This task needs additional resources to complete on time."
 *                 userId:
 *                   type: string
 *                   example: 12345
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/:
 *   get:
 *     summary: Get all comments (admin or user-specific)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 54321
 *                   taskId:
 *                     type: string
 *                     example: 67890
 *                   content:
 *                     type: string
 *                     example: "This task needs additional resources to complete on time."
 *                   userId:
 *                     type: string
 *                     example: 12345
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/task/{taskId}:
 *   get:
 *     summary: Get comments by task ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 67890
 *         description: ID of the task to retrieve comments for
 *     responses:
 *       200:
 *         description: List of comments for the task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 54321
 *                   taskId:
 *                     type: string
 *                     example: 67890
 *                   content:
 *                     type: string
 *                     example: "This task needs additional resources to complete on time."
 *                   userId:
 *                     type: string
 *                     example: 12345
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/user/{userId}:
 *   get:
 *     summary: Get comments by user ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *         description: ID of the user to retrieve comments for
 *     responses:
 *       200:
 *         description: List of comments by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 54321
 *                   taskId:
 *                     type: string
 *                     example: 67890
 *                   content:
 *                     type: string
 *                     example: "This task needs additional resources to complete on time."
 *                   userId:
 *                     type: string
 *                     example: 12345
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/task/{taskId}/user/{userId}:
 *   get:
 *     summary: Get comments by task and user
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 67890
 *         description: ID of the task to retrieve comments for
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *         description: ID of the user to retrieve comments for
 *     responses:
 *       200:
 *         description: List of comments for the task and user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 54321
 *                   taskId:
 *                     type: string
 *                     example: 67890
 *                   content:
 *                     type: string
 *                     example: "This task needs additional resources to complete on time."
 *                   userId:
 *                     type: string
 *                     example: 12345
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 54321
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentUpdate'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 54321
 *                 taskId:
 *                   type: string
 *                   example: 67890
 *                 content:
 *                   type: string
 *                   example: "Updated: Task requires urgent attention."
 *                 userId:
 *                   type: string
 *                   example: 12345
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-22T15:30:00Z
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           example: 54321
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid request
 */