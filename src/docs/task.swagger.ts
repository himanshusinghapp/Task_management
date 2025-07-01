/**
 * @swagger
 * tags:
 *   - name: Task
 *     description: Task management for admins and users
 *   - name: Comment
 *     description: Comment management for tasks
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         title:
 *           type: string
 *           example: Complete Project Report
 *         description:
 *           type: string
 *           example: Write and submit the project report by end of week
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: pending
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: 2025-07-01T00:00:00Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         assignedTo:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b124
 *         createdBy:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b125
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           example: [Urgent, Project]
 *         blockedBy:
 *           type: array
 *           items:
 *             type: string
 *           example: [60d5ec49f1b2c4b3c8e4b126]
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           example: [file1.pdf, file2.jpg]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-23T10:59:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-23T10:59:00Z
 *     TaskCreate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Complete Project Report
 *         description:
 *           type: string
 *           example: Write and submit the project report by end of week
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: 2025-07-01T00:00:00Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         assignedTo:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b124
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           example: [Urgent, Project]
 *         blockedBy:
 *           type: array
 *           items:
 *             type: string
 *           example: [60d5ec49f1b2c4b3c8e4b126]
 *       required:
 *         - title
 *         - assignedTo
 *     TaskUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Updated Project Report
 *         description:
 *           type: string
 *           example: Revised report with additional sections
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           example: in-progress
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: 2025-07-10T00:00:00Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           example: [Important, Project]
 *         blockedBy:
 *           type: array
 *           items:
 *             type: string
 *           example: [60d5ec49f1b2c4b3c8e4b127]
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b128
 *         taskId:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         text:
 *           type: string
 *           example: Please review the draft by tomorrow
 *         createdBy:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b124
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-06-23T10:59:00Z
 *     CommentCreate:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         text:
 *           type: string
 *           example: Please review the draft by tomorrow
 *       required:
 *         - taskId
 *         - text
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
 */

/**
 * @swagger
 * /tasks/:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new task. Only admins can create tasks. The `blockedBy` field is optional and should be an empty array (`[]`) or omitted for the first task when no other tasks exist. For subsequent tasks, obtain `blockedBy` IDs from `GET /tasks`, `GET /tasks/filter/by-label/{label}`, or `GET /tasks/filter/by-date/{month}/{year}`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreate'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request data (e.g., invalid blockedBy IDs)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (non-admin user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves all tasks for admins or assigned tasks for users.
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves a task by ID. Users can only view their assigned tasks.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         description: ID of the task to retrieve
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (user not assigned to task)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Updates a task. Users can only update their assigned tasks, and only admins can reassign tasks.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated
 *                 updated:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (user not assigned or non-admin trying to reassign)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a task. Users can only delete their assigned tasks.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (user not assigned to task)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/{taskId}/attachments:
 *   post:
 *     summary: Upload attachments to a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Uploads attachments to a task. Users can only upload to their assigned tasks.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60d5ec49f1b2c4b3c8e4b123
 *         description: ID of the task to upload attachments to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - attachments
 *     responses:
 *       200:
 *         description: Attachments uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (user not assigned to task)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/filter/{label}:
 *   get:
 *     summary: Get tasks by label
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves tasks with the specified label. Users only see their assigned tasks.
 *     parameters:
 *       - in: path
 *         name: label
 *         required: true
 *         schema:
 *           type: string
 *           example: Urgent
 *         description: Label to filter tasks
 *     responses:
 *       200:
 *         description: List of tasks with specified label
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /tasks/filter/{month}/{year}:
 *   get:
 *     summary: Filter tasks by month and year
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves tasks due in the specified month and year. Users only see their assigned tasks.
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 7
 *         description: Month to filter tasks (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: Year to filter tasks
 *     responses:
 *       200:
 *         description: List of tasks for specified month and year
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
