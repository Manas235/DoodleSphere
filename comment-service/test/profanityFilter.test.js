/**
 * Verification test for profanityFilter moderation logic
 * Can be run using native Node: node test/profanityFilter.test.js
 */

const assert = require('assert');
const { detectRestrictedWords, normalizeText, profanityFilter } = require('../src/middleware/profanityFilter');

console.log('🧪 Running profanityFilter Moderation Unit Tests...\n');

// Test 1: Normalization & Leetspeak evasion
const leetInput = 'This is a $c@m message!';
const normalized = normalizeText(leetInput);
assert(normalized.includes('scam'), `Expected "scam" in normalized text, got: "${normalized}"`);
console.log('✅ Test 1 Passed: Leetspeak normalization correctly decoded "$c@m" to "scam"');

// Test 2: Word Boundary Detection (avoid false positive like "scampi")
const falsePositive = 'I love shrimp scampi for dinner.';
const matchesFalsePositive = detectRestrictedWords(falsePositive, ['scam']);
assert.strictEqual(matchesFalsePositive.length, 0, 'False positive detected on "scampi"');
console.log('✅ Test 2 Passed: Word boundaries prevent false positive on "scampi"');

// Test 3: Direct restricted word match
const offensiveInput = 'This post is pure hate and spam.';
const detected = detectRestrictedWords(offensiveInput, ['hate', 'spam']);
assert.deepStrictEqual(detected, ['hate', 'spam']);
console.log('✅ Test 3 Passed: Successfully flagged restricted words ["hate", "spam"]');

// Test 4: Middleware BLOCK Policy Mock Execution
const mockReqBlocked = {
  body: { text: 'Join my investment scam today!' }
};
let blockedStatus = null;
let blockedJson = null;
const mockResBlocked = {
  status: (code) => {
    blockedStatus = code;
    return {
      json: (data) => { blockedJson = data; }
    };
  }
};
const middlewareBlock = profanityFilter({ policy: 'BLOCK' });
middlewareBlock(mockReqBlocked, mockResBlocked, () => {
  assert.fail('next() should not be called when policy is BLOCK and word is detected');
});
assert.strictEqual(blockedStatus, 422, 'Expected status 422 for blocked content');
assert.strictEqual(blockedJson.moderation.action, 'REJECTED');
console.log('✅ Test 4 Passed: Middleware successfully blocked restricted comment with HTTP 422');

// Test 5: Middleware FLAG Policy Mock Execution
const mockReqFlagged = {
  body: { text: 'You should not hate others.' }
};
const mockResFlagged = {};
let nextCalled = false;
const middlewareFlag = profanityFilter({ policy: 'FLAG' });
middlewareFlag(mockReqFlagged, mockResFlagged, () => {
  nextCalled = true;
});
assert.strictEqual(nextCalled, true, 'next() must be called when policy is FLAG');
assert.strictEqual(mockReqFlagged.moderation.flagged, true);
assert.strictEqual(mockReqFlagged.moderation.action, 'FLAGGED_FOR_REVIEW');
console.log('✅ Test 5 Passed: Middleware flagged comment for review and called next()');

console.log('\n🎉 All moderation logic unit tests passed successfully!\n');
