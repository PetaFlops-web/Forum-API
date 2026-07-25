/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with username, fullname, password and email
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullname
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: Unique username
 *               fullname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: User's full name
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password (will be hashed with bcrypt)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *             example:
 *               username: johndoe
 *               fullname: John Doe
 *               password: securePassword123
 *               email: john@example.com
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedUser:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         fullname:
 *                           type: string
 *                         email:
 *                           type: string
 *               example:
 *                 status: success
 *                 data:
 *                   addedUser:
 *                     id: user-12345
 *                     username: johndoe
 *                     fullname: John Doe
 *                     email: john@example.com
 *       '400':
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: Conflict - username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
