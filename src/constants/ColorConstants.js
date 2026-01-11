// Color Palette Constants
// Extracted from QuizCraft design PDF

export const COLORS = {
  // Primary Colors (Purple/Blue from design)
  PRIMARY: '#6C5CE7',
  PRIMARY_LIGHT: '#A29BFE',
  PRIMARY_DARK: '#5F3DC4',

  // Secondary Colors
  SECONDARY: '#00B894',
  SECONDARY_LIGHT: '#55EFC4',
  SECONDARY_DARK: '#00916E',

  // Success, Warning, Error
  SUCCESS: '#00B894',
  WARNING: '#FDCB6E',
  ERROR: '#FF6B6B',
  INFO: '#74B9FF',

  // Grayscale
  BLACK: '#2D3436',
  DARK_GRAY: '#636E72',
  GRAY: '#B2BEC3',
  LIGHT_GRAY: '#DFE6E9',
  LIGHTER_GRAY: '#F5F6FA',
  WHITE: '#FFFFFF',

  // Background
  BACKGROUND: '#FAFBFC',
  CONTAINER_BG: '#FFFFFF',

  // Text
  TEXT_PRIMARY: '#2D3436',
  TEXT_SECONDARY: '#636E72',
  TEXT_DISABLED: '#B2BEC3',

  // Borders
  BORDER: '#E0E0E0',
  BORDER_LIGHT: '#F0F0F0',

  // Status Colors
  PUBLISHED: '#00B894',
  DRAFT: '#FDCB6E',
  DISABLED: '#B2BEC3',

  // Quiz Status
  CORRECT: '#00B894',
  INCORRECT: '#FF6B6B',
  UNATTEMPTED: '#B2BEC3',
  MARKED: '#FDCB6E',
};

// CSS Variables for easy theming
export const CSS_VARIABLES = {
  '--primary-color': COLORS.PRIMARY,
  '--primary-light': COLORS.PRIMARY_LIGHT,
  '--primary-dark': COLORS.PRIMARY_DARK,
  '--secondary-color': COLORS.SECONDARY,
  '--success-color': COLORS.SUCCESS,
  '--warning-color': COLORS.WARNING,
  '--error-color': COLORS.ERROR,
  '--info-color': COLORS.INFO,
  '--background': COLORS.BACKGROUND,
  '--container-bg': COLORS.CONTAINER_BG,
  '--text-primary': COLORS.TEXT_PRIMARY,
  '--text-secondary': COLORS.TEXT_SECONDARY,
  '--border-color': COLORS.BORDER,
};
