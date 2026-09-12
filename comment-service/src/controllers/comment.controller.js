/**
 * Comment Controller
 * Handles comment creation and status assignment based on moderation metadata.
 */

// In-memory comment repository for isolated service scope
const commentsStore = [];

const commentController = {
  /**
   * Creates a new comment, applying status based on middleware moderation results.
   */
  createComment: async (req, res) => {
    try {
      const { postId, author, text, parentId = null } = req.body;

      if (!postId || !text) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'postId and text are required fields.'
        });
      }

      // Check moderation metadata set by profanityFilter middleware
      const isFlagged = req.moderation && req.moderation.flagged;

      const comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        postId,
        parentId,
        author: author || 'Anonymous Scribe',
        text,
        status: isFlagged ? 'PENDING_MODERATION' : 'PUBLISHED',
        moderationMetadata: req.moderation || { flagged: false },
        createdAt: new Date().toISOString()
      };

      commentsStore.unshift(comment);

      if (isFlagged) {
        return res.status(202).json({
          success: true,
          message: 'Comment submitted and queued for moderator review.',
          data: {
            id: comment.id,
            status: comment.status,
            createdAt: comment.createdAt
          }
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Comment published successfully.',
        data: comment
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      });
    }
  },

  /**
   * Retrieves comments for a post (for testing and verification)
   */
  getCommentsByPost: async (req, res) => {
    const { postId } = req.params;
    const postComments = commentsStore.filter(c => c.postId === postId);
    return res.status(200).json({
      success: true,
      data: postComments
    });
  }
};

module.exports = commentController;
