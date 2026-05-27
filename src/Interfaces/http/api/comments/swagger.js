/**
 * @swagger
 * /threads/{threadId}/comments:
 *   post:
 *     summary: Add a comment to a thread
 *     description: Create a new comment on a specific thread (requires authentication)
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: threadId
 *         in: path
 *         required: true
 *         description: The ID of the thread to comment on
 *         schema:
 *           type: string
 *         example: thread-1a2b3c
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 description: The comment content
 *             example:
 *               content: You can download Node.js from nodejs.org
 *     responses:
 *       '201':
 *         description: Comment created successfully
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
 *                     addedComment:
 *                       $ref: '#/components/schemas/Comment'
 *             example:
 *               status: success
 *               data:
 *                 addedComment:
 *                   id: comment-xyz
 *                   content: You can download Node.js from nodejs.org
 *                   owner: user-67890
 *                   threadId: thread-1a2b3c
 *                   createdAt: 2024-01-15T11:00:00Z
 *                   isDelete: false
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
 *
 * /threads/{threadId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment from a thread (only by comment owner or admin, requires authentication)
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: threadId
 *         in: path
 *         required: true
 *         description: The ID of the thread containing the comment
 *         schema:
 *           type: string
 *         example: thread-1a2b3c
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *         example: comment-xyz
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *             example:
 *               status: success
 *       '401':
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden - not comment owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Thread or comment not found
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
