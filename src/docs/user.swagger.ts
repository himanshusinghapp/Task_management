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
 * /user/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: OTP sent to email
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /user/resend-otp:
 *   post:
 *     summary: Resend OTP for email verification
 *     tags: [User]
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
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Missing user ID
 */

/**
 * @swagger
 * /user/verify-email:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [User]
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
 *             required:
 *               - userId
 *               - otp
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
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