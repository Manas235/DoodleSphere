/**
 * Moderation Configuration & Restricted Words Dictionary
 * Supports blocklist entries, regex patterns, and leetspeak normalization.
 */

module.exports = {
  // Configurable moderation policy: 'BLOCK' (reject immediately) or 'FLAG' (queue for manual review)
  defaultPolicy: process.env.MODERATION_POLICY || 'BLOCK',

  // Basic list of restricted profanities, hate speech, and spam terms
  restrictedWords: [
    'hate',
    'abuse',
    'scam',
    'spam',
    'offensiveword1',
    'offensiveword2',
    'curseword'
  ],

  // Common leetspeak substitutions to avoid simple bypasses
  leetSubstitutions: {
    '@': 'a',
    '4': 'a',
    '8': 'b',
    '3': 'e',
    '1': 'i',
    '!': 'i',
    '0': 'o',
    '$': 's',
    '5': 's',
    '7': 't'
  },

  // HTTP status code returned when a comment is blocked
  blockStatusCode: 422
};
