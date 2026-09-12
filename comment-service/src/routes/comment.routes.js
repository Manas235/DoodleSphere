/**
 * Comment Service Routes
 * Demonstrates route protection using the profanityFilter middleware.
 */

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { profanityFilter } = require('../middleware/profanityFilter');

// Standard endpoint: Intercepts and immediately BLOCKS comments violating guidelines (422)
router.post(
  '/',
  profanityFilter({ policy: 'BLOCK' }),
  commentController.createComment
);

// Alternative endpoint: Soft moderation - FLAGS comments and queues for review (202 PENDING_MODERATION)
router.post(
  '/queued',
  profanityFilter({ policy: 'FLAG' }),
  commentController.createComment
);

// Read comments by post ID
router.get('/post/:postId', commentController.getCommentsByPost);

module.exports = router;
