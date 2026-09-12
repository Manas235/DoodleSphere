/**
 * Profanity & Moderation Filter Middleware
 * Intercepts incoming comment payload and flags or blocks restricted terms.
 */

const moderationConfig = require('../config/moderation.config');

/**
 * Normalizes text to defend against simple evasion tactics (leetspeak, punctuation padding)
 * @param {string} text - Raw input string
 * @returns {string} Normalized string
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  let normalized = text.toLowerCase();

  // Substitute common leetspeak characters
  for (const [char, replacement] of Object.entries(moderationConfig.leetSubstitutions)) {
    normalized = normalized.split(char).join(replacement);
  }

  // Remove repeated non-alphanumeric noise while preserving basic spacing
  normalized = normalized.replace(/[^a-z0-9\s]/g, ' ');

  return normalized;
}

/**
 * Scans normalized text for restricted terms using regex word boundaries.
 * @param {string} rawText - Input string to inspect
 * @param {Array<string>} restrictedWords - List of prohibited keywords
 * @returns {Array<string>} Array of matched restricted words
 */
function detectRestrictedWords(rawText, restrictedWords) {
  const normalized = normalizeText(rawText);
  const detected = [];

  for (const word of restrictedWords) {
    // Word boundary check to prevent false positives (e.g., "scampi" matching "spam")
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalized)) {
      detected.push(word);
    }
  }

  return detected;
}

/**
 * Express Middleware Factory
 * @param {Object} options
 * @param {string} [options.policy] - 'BLOCK' | 'FLAG'
 * @param {Array<string>} [options.customWords] - Additional restricted words
 * @param {string} [options.textField] - Target body key (defaults to 'text' or 'content')
 */
function profanityFilter(options = {}) {
  const policy = options.policy || moderationConfig.defaultPolicy;
  const wordList = options.customWords 
    ? [...moderationConfig.restrictedWords, ...options.customWords]
    : moderationConfig.restrictedWords;
  const textField = options.textField || 'text';

  return (req, res, next) => {
    // Extract text from body (checks options.textField, 'text', or 'content')
    const rawContent = req.body?.[textField] || req.body?.content || req.body?.text;

    if (!rawContent || typeof rawContent !== 'string') {
      return next();
    }

    const flaggedWords = detectRestrictedWords(rawContent, wordList);

    if (flaggedWords.length > 0) {
      if (policy === 'BLOCK') {
        return res.status(moderationConfig.blockStatusCode).json({
          success: false,
          error: 'Content Policy Violation',
          message: 'Your comment contains language that violates our community guidelines.',
          moderation: {
            action: 'REJECTED',
            flaggedCount: flaggedWords.length,
            flaggedWords: process.env.NODE_ENV === 'production' ? undefined : flaggedWords
          }
        });
      }

      // Policy is 'FLAG': attach metadata and allow routing to proceed with PENDING status
      req.moderation = {
        flagged: true,
        action: 'FLAGGED_FOR_REVIEW',
        flaggedWords,
        timestamp: new Date().toISOString()
      };
      return next();
    }

    // Clean comment
    req.moderation = {
      flagged: false,
      action: 'PASSED'
    };

    next();
  };
}

module.exports = {
  profanityFilter,
  normalizeText,
  detectRestrictedWords
};
