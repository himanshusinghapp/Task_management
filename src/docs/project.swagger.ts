/**
 * @swagger
 * tags:
 *   - name: Project
 *     description: Project management for admins
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Redesign company website with modern UI
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2025-06-01
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2025-08-31
 *       required:
 *         - name
 *         - description
 *         - startDate
 *         - endDate
 *     AssignMembers:
 *       type: object
 *       properties:
 *         memberIds:
 *           type: array
 *           items:
 *             type: string
 *             example: 12345
 *       required:
 *         - memberIds
 *     AssignTasks:
 *       type: object
 *       properties:
 *         taskIds:
 *           type: array
 *           items:
 *             type: string
 *             example: 67890
 *       required:
 *         - taskIds
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /project/:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreate'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 98765
 *                     name:
 *                       type: string
 *                       example: Website Redesign
 *                     description:
 *                       type: string
 *                       example: Redesign company website with modern UI
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-06-01
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-08-31
 *                     createdBy:
 *                       type: string
 *                       example: 54321
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 98765
 *                   name:
 *                     type: string
 *                     example: Website Redesign
 *                   description:
 *                     type: string
 *                     example: Redesign company website with modern UI
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-06-01
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: 2025-08-31
 *                   createdBy:
 *                     type: string
 *                     example: 54321
 *                   members:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: 12345
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: 67890
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project/{projectId}/assign-members:
 *   post:
 *     summary: Assign members to a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 98765
 *         description: ID of the project to assign members to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignMembers'
 *     responses:
 *       200:
 *         description: Members assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Members assigned to project
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 98765
 *                     members:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 12345
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /project/{projectId}/assign-tasks:
 *   post:
 *     summary: Assign tasks to a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           example: 98765
 *         description: ID of the project to assign tasks to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignTasks'
 *     responses:
 *       200:
 *         description: Tasks assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks assigned to project
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 98765
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 67890
 *       400:
 *         description: Invalid request
 */