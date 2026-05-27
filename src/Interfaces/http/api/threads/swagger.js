/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create a new thread
 *     description: Create a new discussion thread (requires authentication)
 *     tags:
 *       - Threads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Thread title
 *               body:
 *                 type: string
 *                 minLength: 1
 *                 description: Thread content/body
 *             example:
 *               title: How to setup Node.js?
 *               body: I want to learn Node.js. Can anyone guide me through the setup process?
 *     responses:
 *       '201':
 *         description: Thread created successfully
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
 *                     addedThread:
 *                       $ref: '#/components/schemas/Thread'
 *             example:
 *               status: success
 *               data:
 *                 addedThread:
 *                   id: thread-1a2b3c
 *                   title: How to setup Node.js?
 *                   body: I want to learn Node.js. Can anyone guide me through the setup process?
 *                   owner: user-12345
 *                   createdAt: 2024-01-15T10:30:00Z
 *                   updatedAt: 2024-01-15T10:30:00Z
 *       '400':
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized - missing or invalid token
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
 *
 * /threads/{threadId}:
 *   get:
 *     summary: Get thread details
 *     description: Retrieve a specific thread with all its comments
 *     tags:
 *       - Threads
 *     parameters:
 *       - name: threadId
 *         in: path
 *         required: true
 *         description: The ID of the thread to retrieve
 *         schema:
 *           type: string
 *         example: thread-1a2b3c
 *     responses:
 *       '200':
 *         description: Thread details retrieved successfully
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
 *                     thread:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Thread'
 *                         - type: object
 *                           properties:
 *                             comments:
 *                               type: array
 *                               description: Array of comments on this thread
 *                               items:
 *                                 $ref: '#/components/schemas/Comment'
 *             example:
 *               status: success
 *               data:
 *                 thread:
 *                   id: thread-1a2b3c
 *                   title: How to setup Node.js?
 *                   body: I want to learn Node.js. Can anyone guide me through the setup process?
 *                   owner: user-12345
 *                   createdAt: 2024-01-15T10:30:00Z
 *                   updatedAt: 2024-01-15T10:30:00Z
 *                   comments:
 *                     - id: comment-xyz
 *                       content: You can download Node.js from nodejs.org
 *                       owner: user-67890
 *                       threadId: thread-1a2b3c
 *                       createdAt: 2024-01-15T11:00:00Z
 *                       isDelete: false
 *       '404':
 *         description: Thread not found
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
