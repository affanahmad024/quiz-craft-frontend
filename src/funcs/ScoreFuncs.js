// Score Calculation Helper Functions
// Quiz-specific utility functions

/**
 * Calculate percentage score
 * @param {number} score - Score obtained
 * @param {number} maxScore - Maximum possible score
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentage = (score, maxScore) => {
  if (!maxScore || maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

/**
 * Check if passed
 * @param {number} percentage - Percentage score
 * @param {number} passingScore - Minimum passing score
 * @returns {boolean} - True if passed
 */
export const hasPassed = (percentage, passingScore) => {
  return percentage >= passingScore;
};

/**
 * Get grade based on percentage
 * @param {number} percentage - Percentage score
 * @returns {string} - Grade (A, B, C, D, F)
 */
export const getGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

/**
 * Get grade color
 * @param {string} grade - Grade letter
 * @returns {string} - MUI color name
 */
export const getGradeColor = (grade) => {
  const colors = {
    A: 'success',
    B: 'info',
    C: 'warning',
    D: 'warning',
    F: 'error',
  };
  return colors[grade] || 'default';
};

/**
 * Calculate average score from attempts
 * @param {array} attempts - Array of attempt objects with score
 * @returns {number} - Average score
 */
export const calculateAverageScore = (attempts) => {
  if (!attempts || attempts.length === 0) return 0;

  const total = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
  return Math.round(total / attempts.length);
};

/**
 * Calculate pass rate
 * @param {number} passed - Number of passed attempts
 * @param {number} total - Total attempts
 * @returns {number} - Pass rate percentage
 */
export const calculatePassRate = (passed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((passed / total) * 100);
};

/**
 * Format score display
 * @param {number} score - Score
 * @param {number} maxScore - Maximum score
 * @returns {string} - Formatted score (e.g., '85/100')
 */
export const formatScore = (score, maxScore) => {
  return `${score}/${maxScore}`;
};

/**
 * Get performance level
 * @param {number} percentage - Percentage score
 * @returns {string} - Performance level (Excellent, Good, Average, Poor)
 */
export const getPerformanceLevel = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Good';
  if (percentage >= 60) return 'Average';
  return 'Poor';
};

/**
 * Calculate streak
 * @param {array} attempts - Array of attempts (sorted by date, newest first)
 * @returns {number} - Current streak
 */
export const calculateStreak = (attempts) => {
  if (!attempts || attempts.length === 0) return 0;

  let streak = 0;
  for (const attempt of attempts) {
    if (attempt.passed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
