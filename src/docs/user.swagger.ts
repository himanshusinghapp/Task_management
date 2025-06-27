/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User authentication & profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123!
 *       required:
 *         - name
 *         - email
 *         - password
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123!
 *       required:
 *         - email
 *         - password
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /user/request-email-verification:
 *   post:
 *     summary: Request OTP for email verification before signup
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /user/verify-email-otp:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *             required:
 *               - email
 *               - otp
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /user/complete-signup:
 *   post:
 *     summary: Complete signup after email verification
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Send OTP to reset password
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent to registered email
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [User]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 12345
 *               otp:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *             required:
 *               - userId
 *               - otp
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or user ID
 */

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe.updated@example.com
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /user/logout:
 *   delete:
 *     summary: Logout user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Invalid request
 */
