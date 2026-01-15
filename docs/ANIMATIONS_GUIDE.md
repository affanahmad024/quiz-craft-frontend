# QuizCraft Animations Guide

Complete guide to using animations in the QuizCraft application.

---

## Overview

QuizCraft features a comprehensive animation system built with **Framer Motion** and **CSS animations**, matching the brand's green gradient theme from the logo (Dark Green `#0D5C3F` to Bright Green `#7ED957`).

---

## Animation System Structure

```
src/
├── styles/
│   ├── animations.js          # Framer Motion animation variants
│   └── animations.css         # CSS animations and utilities
│
└── components/animations/
    ├── index.js               # Central export
    ├── PageTransition.jsx     # Page-level transitions
    ├── AnimatedCard.jsx       # Animated Material-UI cards
    ├── AnimatedButton.jsx     # Animated buttons
    ├── FadeInView.jsx         # Fade-in wrapper
    ├── LoadingSpinner.jsx     # Circular spinner loader
    ├── LoadingDots.jsx        # Bouncing dots loader
    └── LoadingPulse.jsx       # Pulsing circle loader
```

---

## Using Animation Components

### 1. Page Transitions

Wrap your page content with `PageTransition` for smooth page-level animations:

```jsx
import { PageTransition } from '../../components/animations';

function MyScreen() {
  return (
    <PageTransition variant="default">
      {/* Page content */}
    </PageTransition>
  );
}
```

**Available variants:**
- `default` - Fade in with slight upward movement
- `slide` - Slide in from right
- `fade` - Simple fade in

---

### 2. Animated Cards

Use `AnimatedCard` for interactive card hover effects:

```jsx
import { AnimatedCard } from '../../components/animations';
import { CardContent, Typography } from '@mui/material';

function QuizCard({ quiz, onClick }) {
  return (
    <AnimatedCard
      onClick={onClick}
      animateHover={true}
      animateTap={true}
      sx={{ p: 2 }}
    >
      <CardContent>
        <Typography variant="h6">{quiz.title}</Typography>
      </CardContent>
    </AnimatedCard>
  );
}
```

**Props:**
- `animateHover` - Lifts card on hover with shadow
- `animateTap` - Scales down slightly on click
- All Material-UI Card props are supported

---

### 3. Animated Buttons

Use `AnimatedButton` for interactive buttons:

```jsx
import { AnimatedButton } from '../../components/animations';

function MyComponent() {
  return (
    <AnimatedButton
      variant="contained"
      color="primary"
      pulse={false}
      animateHover={true}
      onClick={handleClick}
    >
      Click Me
    </AnimatedButton>
  );
}
```

**Props:**
- `pulse` - Enables pulsing animation (for CTAs)
- `animateHover` - Hover and tap effects
- All Material-UI Button props are supported

---

### 4. Fade In Views

Wrap any content to fade it in:

```jsx
import { FadeInView } from '../../components/animations';

function MyComponent() {
  return (
    <FadeInView direction="up" delay={0.2} duration={0.5}>
      <Typography>This content fades in</Typography>
    </FadeInView>
  );
}
```

**Props:**
- `direction`: `'up'` | `'down'` | `'left'` | `'right'` | `'none'`
- `delay`: Delay in seconds (default: 0)
- `duration`: Duration in seconds (default: 0.5)

---

### 5. Loading Components

#### LoadingSpinner
Circular rotating spinner:

```jsx
import { LoadingSpinner } from '../../components/animations';

function MyScreen() {
  return (
    <LoadingSpinner
      size={60}
      message="Loading quizzes..."
      fullscreen={true}
    />
  );
}
```

#### LoadingDots
Bouncing dots animation:

```jsx
import { LoadingDots } from '../../components/animations';

function MyComponent() {
  return <LoadingDots size={12} color="#0D5C3F" />;
}
```

#### LoadingPulse
Pulsing gradient circle:

```jsx
import { LoadingPulse } from '../../components/animations';

function MyScreen() {
  return <LoadingPulse size={80} />;
}
```

---

## Using Animation Variants (Framer Motion)

Import animation variants for custom motion components:

```jsx
import { motion } from 'framer-motion';
import {
  fadeInUp,
  cardHover,
  questionReveal,
  correctAnswer
} from '../../styles/animations';

function MyComponent() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      Content
    </motion.div>
  );
}
```

### Available Variant Categories

**Page Transitions:**
- `pageTransition` - Default page animation
- `pageSlideTransition` - Slide transition
- `pageFadeTransition` - Fade transition

**Fade Animations:**
- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`

**Scale Animations:**
- `scaleIn`, `scalePop`, `scaleOnHover`, `scaleOnTap`

**Card Animations:**
- `cardHover`, `cardTap`, `cardFlip`

**Button Animations:**
- `buttonHover`, `buttonPulse`, `buttonShine`

**Loading Animations:**
- `loadingSpinner`, `loadingPulse`, `loadingBounce`, `loadingDots`

**Quiz-Specific:**
- `questionReveal` - Question slide-in animation
- `answerOption` - Staggered answer reveal
- `correctAnswer` - Green flash for correct answers
- `wrongAnswer` - Shake animation for wrong answers
- `progressBarFill` - Smooth progress bar fill
- `timerWarning` - Pulsing red timer warning
- `scoreReveal` - Pop-in score animation
- `successBurst` - Success celebration effect

**Modal/Dialog:**
- `modalBackdrop`, `modalContent`, `modalSlideUp`

**List Animations:**
- `listItem`, `listItemExit`

**Stagger Containers:**
- `staggerContainer`, `staggerFast`, `staggerSlow`

---

## Using CSS Animation Classes

Add CSS animation classes directly to elements:

```jsx
<div className="animate-fade-in-up">
  This content fades in from below
</div>

<div className="animate-hover-lift">
  This card lifts on hover
</div>

<div className="animate-gradient-shift">
  Background gradient shifts
</div>
```

### Available CSS Classes

**Basic Animations:**
- `animate-fade-in`
- `animate-fade-in-up`
- `animate-fade-in-down`
- `animate-scale-in`
- `animate-slide-in-left`
- `animate-slide-in-right`

**Loading:**
- `animate-spinner`
- `animate-pulse`
- `animate-bounce`

**Interactive:**
- `animate-hover-lift`
- `animate-hover-scale`
- `animate-tap-scale`

**Quiz-Specific:**
- `animate-correct-answer`
- `animate-wrong-answer`
- `animate-timer-warning`
- `animate-score-reveal`

**Gradient Effects:**
- `animate-gradient-shift` - Shifting gradient background
- `animate-glow-pulse` - Pulsing green glow effect

**Skeleton/Placeholders:**
- `skeleton-pulse`
- `skeleton-shimmer`

**Transitions:**
- `transition-all`
- `transition-fast`
- `transition-slow`
- `transition-transform`
- `transition-opacity`
- `transition-colors`

**Hover Effects:**
- `hover-brightness`
- `hover-saturate`
- `hover-shadow-lift`

**Focus:**
- `focus-ring-green`
- `focus-ring-inset`

---

## Staggered Animations

For staggered child animations (like lists):

```jsx
import { motion } from 'framer-motion';
import { staggerContainer, listItem } from '../../styles/animations';

function QuizList({ quizzes }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz.id}
          custom={index}
          variants={listItem}
        >
          <QuizCard quiz={quiz} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## Quiz-Taking Animations

### Question Transitions

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { questionReveal } from '../../styles/animations';

function QuizQuestion({ question, questionNumber }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionNumber}
        variants={questionReveal}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Typography variant="h5">{question.text}</Typography>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Answer Feedback

```jsx
import { motion } from 'framer-motion';
import { correctAnswer, wrongAnswer } from '../../styles/animations';

function AnswerOption({ answer, isSelected, isCorrect, showResult }) {
  return (
    <motion.div
      animate={showResult && isSelected ? (isCorrect ? 'animate' : undefined) : undefined}
      variants={isCorrect ? correctAnswer : wrongAnswer}
      className={showResult && !isCorrect && isSelected ? 'animate-wrong-answer' : ''}
    >
      {answer.text}
    </motion.div>
  );
}
```

### Progress Bar

```jsx
import { motion } from 'framer-motion';
import { progressBarFill } from '../../styles/animations';

function QuizProgress({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <Box sx={{ width: '100%', height: 8, bgcolor: '#E0E0E0', borderRadius: 4 }}>
      <motion.div
        custom={progress}
        variants={progressBarFill}
        initial="initial"
        animate="animate"
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #0D5C3F 0%, #7ED957 100%)',
          borderRadius: 4,
        }}
      />
    </Box>
  );
}
```

### Timer Warning

```jsx
<Typography
  variant="h4"
  className={timeRemaining < 60 ? 'animate-timer-warning' : ''}
>
  {formatTime(timeRemaining)}
</Typography>
```

### Score Reveal

```jsx
<motion.div
  variants={scoreReveal}
  initial="initial"
  animate="animate"
  className="animate-score-reveal"
>
  <Typography variant="h2">{score}%</Typography>
</motion.div>
```

---

## Accessibility

The animation system respects user preferences:

- **Reduced motion**: Animations are disabled for users with `prefers-reduced-motion` enabled
- **Hover effects**: Disabled on touch devices
- **Focus indicators**: Green-themed focus rings for keyboard navigation

---

## Color Palette

All animations use QuizCraft's brand colors from the logo:

- **Dark Green**: `#0D5C3F`
- **Medium Green**: `#159F5E`
- **Bright Green**: `#7ED957`
- **Gradient**: `linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)`

---

## Best Practices

1. **Use PageTransition** for all screens/pages
2. **Use AnimatedCard** for clickable cards
3. **Apply stagger animations** for lists
4. **Show loading states** with appropriate loaders
5. **Provide feedback** with correct/wrong answer animations
6. **Respect reduced motion** preferences
7. **Keep animations fast** (200-500ms typically)
8. **Use green theme colors** consistently

---

## Examples in Context

### Quiz List Screen

```jsx
import { PageTransition, AnimatedCard } from '../../components/animations';
import { motion } from 'framer-motion';
import { staggerContainer, listItem } from '../../styles/animations';

function QuizListScreen() {
  return (
    <PageTransition variant="default">
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {quizzes.map((quiz, index) => (
          <motion.div key={quiz.id} custom={index} variants={listItem}>
            <AnimatedCard onClick={() => navigate(`/quizzes/${quiz.id}`)}>
              <QuizCard quiz={quiz} />
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  );
}
```

### Loading State

```jsx
import { LoadingSpinner } from '../../components/animations';

function QuizDetailScreen() {
  if (loading) {
    return <LoadingSpinner fullscreen message="Loading quiz..." />;
  }

  return <PageTransition>{/* Content */}</PageTransition>;
}
```

---

**Last Updated**: January 2026
**Animation System**: ✅ Complete and Production-Ready
