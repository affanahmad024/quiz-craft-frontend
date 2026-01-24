// AI Constants
// Following Phoenix pattern

export const AI_FEATURE_TYPES = {
  GENERATE_FROM_TEXT: 'generate_from_text',
  GENERATE_FROM_FILE: 'generate_from_file',
  EXTRACT_FROM_FILE: 'extract_from_file',
};

export const AI_FEATURE_LABELS = {
  [AI_FEATURE_TYPES.GENERATE_FROM_TEXT]: 'Generate from Text',
  [AI_FEATURE_TYPES.GENERATE_FROM_FILE]: 'Generate from Documents',
  [AI_FEATURE_TYPES.EXTRACT_FROM_FILE]: 'Extract from Quiz Image',
};

export const AI_FEATURE_DESCRIPTIONS = {
  [AI_FEATURE_TYPES.GENERATE_FROM_TEXT]:
    'Paste your study notes or content, and AI will generate quiz questions from the text.',
  [AI_FEATURE_TYPES.GENERATE_FROM_FILE]:
    'Upload your PDF, DOCX, or TXT study materials, and AI will create quiz questions from them.',
  [AI_FEATURE_TYPES.EXTRACT_FROM_FILE]:
    'Upload an image or PDF of an existing quiz, and AI will extract and digitize the questions.',
};

export const AI_GENERATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const AI_DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const AI_DIFFICULTY_LABELS = {
  [AI_DIFFICULTY_LEVELS.EASY]: 'Easy',
  [AI_DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
  [AI_DIFFICULTY_LEVELS.HARD]: 'Hard',
};

export const AI_QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  MIXED: 'mixed',
};

export const AI_QUESTION_TYPE_LABELS = {
  [AI_QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
  [AI_QUESTION_TYPES.TRUE_FALSE]: 'True/False',
  [AI_QUESTION_TYPES.MIXED]: 'Mixed (MC + T/F)',
};

export const AI_VALIDATION = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  MAX_TEXT_LENGTH: 50000,
  MAX_FILE_SIZE_MB: 10,
  ACCEPTED_FILE_TYPES: {
    GENERATE: ['.pdf', '.docx', '.txt'],
    EXTRACT: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
};

export const AI_POLLING_INTERVAL_MS = 3000; // Poll every 3 seconds
