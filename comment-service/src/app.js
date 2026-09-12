/**
 * Comment Service - Express Application Entry Point
 * Isolated microservice instance for comment handling & moderation.
 */

const express = require('express');
const commentRoutes = require('./routes/comment.routes');

const app = express();

// Body parser
app.use(express.json());

// Mount comment routes under /api/comments
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'comment-service' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Comment Service Error]:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

module.exports = app;
