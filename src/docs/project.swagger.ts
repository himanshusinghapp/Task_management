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
 *       required:
 *         - name
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Updated description
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
 *     RemoveMembers:
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
 *     RemoveTasks:
 *       type: object
 *       properties:
 *         taskIds:
 *           type: array
 *           items:
 *             type: string
 *             example: 67890
 *       required:
 *         - taskIds
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 98765
 *         name:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Redesign company website with modern UI
 *         createdBy:
 *           type: string
 *           example: 54321
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             example: 12345
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *             example: 67890
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
 *                   example: Project created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Projects fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /project/{projectId}:
 *   patch:
 *     summary: Update a project
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
 *         description: ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request
 *   delete:
 *     summary: Delete a project
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
 *         description: ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 98765
 *       400:
 *         description: Invalid request
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
 *                   example: Members assigned successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request
 * /project/{projectId}/remove-members:
 *   patch:
 *     summary: Remove members from a project
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
 *         description: ID of the project to remove members from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveMembers'
 *     responses:
 *       200:
 *         description: Members removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Members removed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
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
 *                   example: Tasks assigned successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request
 * /project/{projectId}/remove-tasks:
 *   patch:
 *     summary: Remove tasks from a project
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
 *         description: ID of the project to remove tasks from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveTasks'
 *     responses:
 *       200:
 *         description: Tasks removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks removed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request
 */