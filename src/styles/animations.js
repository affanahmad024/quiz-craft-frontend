// Animation Variants for Framer Motion
// QuizCraft themed animations matching the green gradient logo
// Based on logo colors: Dark Green (#0D5C3F) to Bright Green (#7ED957)

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1], // Material Design easing
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    }
  }
};

export const pageSlideTransition = {
  initial: { opacity: 0, x: 100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.4,
    }
  }
};

export const pageFadeTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  }
};

// ============================================
// STAGGER ANIMATIONS
// ============================================

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

export const staggerSlow = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    }
  }
};

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

export const scalePop = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    }
  }
};

export const scaleOnHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  }
};

export const scaleOnTap = {
  rest: { scale: 1 },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    }
  }
};

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  },
  hover: {
    y: -8,
    boxShadow: '0px 12px 24px rgba(13, 92, 63, 0.15)', // Using dark green with opacity
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  }
};

export const cardTap = {
  rest: { scale: 1 },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    }
  }
};

export const cardFlip = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
    }
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
    }
  }
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonHover = {
  rest: {
    scale: 1,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0px 6px 16px rgba(13, 92, 63, 0.25)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    }
  },
  tap: {
    scale: 0.97,
  }
};

export const buttonPulse = {
  rest: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    }
  }
};

export const buttonShine = {
  initial: { x: '-100%' },
  hover: {
    x: '100%',
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    }
  }
};

// ============================================
// LOADING ANIMATIONS
// ============================================

export const loadingSpinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

export const loadingPulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

export const loadingBounce = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

export const loadingDots = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// ============================================
// QUIZ-SPECIFIC ANIMATIONS
// ============================================

// Question reveal animation
export const questionReveal = {
  initial: { opacity: 0, x: 100, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.95,
    transition: {
      duration: 0.3,
    }
  }
};

// Answer option animation
export const answerOption = {
  initial: { opacity: 0, x: -20 },
  animate: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  })
};

// Correct answer animation
export const correctAnswer = {
  animate: {
    backgroundColor: ['#ffffff', '#7ED957', '#ffffff'], // Bright green from logo
    scale: [1, 1.03, 1],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    }
  }
};

// Wrong answer animation
export const wrongAnswer = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    }
  }
};

// Progress bar fill animation
export const progressBarFill = {
  initial: { width: '0%' },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    }
  })
};

// Timer warning animation
export const timerWarning = {
  animate: {
    color: ['#FF6B6B', '#FF4757', '#FF6B6B'],
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// Score reveal animation
export const scoreReveal = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.8,
      times: [0, 0.7, 1],
      ease: [0.4, 0, 0.2, 1],
    }
  }
};

// Success confetti burst
export const successBurst = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 1,
      ease: 'easeOut',
    }
  }
};

// ============================================
// MODAL/DIALOG ANIMATIONS
// ============================================

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    }
  }
};

export const modalSlideUp = {
  initial: { opacity: 0, y: '100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: 0.3,
    }
  }
};

// ============================================
// LIST ANIMATIONS
// ============================================

export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    }
  })
};

export const listItemExit = {
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    }
  }
};

// ============================================
// NOTIFICATION/TOAST ANIMATIONS
// ============================================

export const toastEnter = {
  initial: { opacity: 0, y: -50, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    }
  }
};

export const toastSlide = {
  initial: { opacity: 0, x: 100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2,
    }
  }
};

// ============================================
// STAT/NUMBER COUNTER ANIMATION
// ============================================

export const counterUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    }
  }
};

// ============================================
// SKELETON/PLACEHOLDER ANIMATIONS
// ============================================

export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

export const skeletonShimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

// ============================================
// GRADIENT ANIMATION (for logo-inspired effects)
// ============================================

export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'linear',
    }
  }
};

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(126, 217, 87, 0.3)',
      '0 0 40px rgba(126, 217, 87, 0.5)',
      '0 0 20px rgba(126, 217, 87, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// ============================================
// EASING PRESETS
// ============================================

export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  materialDesign: [0.4, 0, 0.2, 1],
  spring: { type: 'spring', stiffness: 260, damping: 20 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 10 },
  springSmooth: { type: 'spring', stiffness: 200, damping: 25 },
};

// ============================================
// DURATION PRESETS
// ============================================

export const durations = {
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.5,
  verySlow: 0.8,
};
