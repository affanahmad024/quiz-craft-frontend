# QuizCraft Frontend - Testing Guide

This document provides comprehensive testing guidelines for the QuizCraft frontend application.

---

## Table of Contents
1. [Overview](#overview)
2. [Testing Environment Setup](#testing-environment-setup)
3. [Manual Testing](#manual-testing)
4. [Browser Compatibility](#browser-compatibility)
5. [Accessibility Testing](#accessibility-testing)
6. [Performance Testing](#performance-testing)
7. [Bug Reporting](#bug-reporting)

---

## Overview

### Testing Approach
- **Manual Testing**: User flow validation
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Responsive Testing**: Mobile, tablet, desktop
- **Accessibility Testing**: WCAG 2.1 compliance
- **Performance Testing**: Load times, bundle size

### Testing Environment
- **Dev Server**: `npm run dev`
- **Production Build**: `npm run build && npm run preview`
- **Backend**: Ensure backend API is running

---

## Testing Environment Setup

### Prerequisites
```bash
# Start backend API (port 8000)
cd quiz-craft-backend
npm start

# Start frontend dev server
cd quiz-craft-frontend
npm run dev
```

### Test Accounts
Create test accounts with different roles:
- **Regular User**: test@example.com
- **Admin User**: admin@example.com
- **Unverified User**: unverified@example.com

---

## Manual Testing

### 1. Authentication Flows

#### Registration Flow
- [ ] Navigate to `/signup`
- [ ] Fill form with valid data
- [ ] Submit and verify success message
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Verify redirect to login
- [ ] Login with new account

**Edge Cases:**
- [ ] Try registering with existing email
- [ ] Submit form with invalid email format
- [ ] Submit with weak password
- [ ] Test password visibility toggle
- [ ] Verify client-side validation

#### Login Flow
- [ ] Navigate to `/login`
- [ ] Login with valid credentials
- [ ] Verify redirect to dashboard
- [ ] Check tokens in localStorage
- [ ] Verify user data loaded

**Edge Cases:**
- [ ] Try login with wrong password
- [ ] Try login with non-existent email
- [ ] Test "Remember Me" functionality
- [ ] Verify unverified user message

#### Password Reset Flow
- [ ] Navigate to `/forgot-password`
- [ ] Enter registered email
- [ ] Submit and verify success message
- [ ] Check email for reset link
- [ ] Click reset link
- [ ] Enter new password
- [ ] Verify redirect to login
- [ ] Login with new password

**Edge Cases:**
- [ ] Try reset with non-existent email
- [ ] Try expired reset token
- [ ] Test password strength requirements

#### Change Password (Authenticated)
- [ ] Login to account
- [ ] Navigate to change password
- [ ] Enter current password
- [ ] Enter new password
- [ ] Submit and verify success
- [ ] Logout and login with new password

**Edge Cases:**
- [ ] Try wrong current password
- [ ] Try weak new password
- [ ] Verify password confirmation match

---

### 2. Quiz Management

#### Create Quiz
- [ ] Navigate to `/quizzes/create`
- [ ] Fill quiz title and description
- [ ] Select category and difficulty
- [ ] Add tags
- [ ] Save quiz (draft)
- [ ] Verify quiz saved

**Questions:**
- [ ] Add MCQ question
- [ ] Add True/False question
- [ ] Add Multiple Answer question
- [ ] Reorder questions (drag-drop)
- [ ] Mark correct answers
- [ ] Set question points
- [ ] Delete question

**Edge Cases:**
- [ ] Try saving without title
- [ ] Add question without text
- [ ] Add MCQ with < 2 options
- [ ] Try publishing without questions

#### Edit Quiz
- [ ] Navigate to quiz list
- [ ] Click edit on a quiz
- [ ] Modify quiz details
- [ ] Add/remove questions
- [ ] Save changes
- [ ] Verify updates saved

**Edge Cases:**
- [ ] Edit published quiz
- [ ] Edit quiz with attempts
- [ ] Cancel editing (no save)

#### Delete Quiz
- [ ] Navigate to quiz list
- [ ] Click delete on a quiz
- [ ] Confirm deletion
- [ ] Verify quiz removed

**Edge Cases:**
- [ ] Try deleting quiz with attempts
- [ ] Cancel deletion dialog

#### Publish Quiz
- [ ] Open draft quiz
- [ ] Click publish
- [ ] Verify quiz appears in discover
- [ ] Check share code generated

---

### 3. Quiz Taking

#### Start Quiz
- [ ] Browse public quizzes
- [ ] Click "Start Quiz" on a quiz
- [ ] Verify quiz loaded
- [ ] Check timer starts (if enabled)

#### Answer Questions
- [ ] Select answer for MCQ
- [ ] Toggle True/False
- [ ] Select multiple answers
- [ ] Navigate next/previous
- [ ] Mark question for review
- [ ] View progress indicator

#### Submit Quiz
- [ ] Review all answers
- [ ] Submit quiz
- [ ] Confirm submission
- [ ] View results immediately

#### Results Page
- [ ] Verify score calculated correctly
- [ ] Check percentage shown
- [ ] Review correct/incorrect answers
- [ ] View time taken
- [ ] Option to retake quiz

**Edge Cases:**
- [ ] Submit with unanswered questions
- [ ] Timer expiration auto-submit
- [ ] Browser refresh during quiz
- [ ] Network error during submission

---

### 4. Discovery & Search

#### Browse Quizzes
- [ ] Navigate to `/discover`
- [ ] View quiz cards
- [ ] Scroll for pagination
- [ ] Click on quiz card

#### Search
- [ ] Use search bar
- [ ] Enter search query
- [ ] Verify filtered results
- [ ] Clear search
- [ ] Test empty results

#### Filters
- [ ] Filter by category
- [ ] Filter by difficulty
- [ ] Filter by tags
- [ ] Combine multiple filters
- [ ] Clear all filters

#### Share Code Access
- [ ] Get share code from quiz
- [ ] Navigate to share code page
- [ ] Enter valid code
- [ ] Verify quiz loads
- [ ] Try invalid code

**Edge Cases:**
- [ ] Search with no results
- [ ] Empty filter state
- [ ] Invalid share code

---

### 5. User Profile

#### View Profile
- [ ] Navigate to `/profile`
- [ ] Verify user info displayed
- [ ] Check statistics cards
- [ ] View created quizzes
- [ ] View attempt history

#### Edit Profile
- [ ] Click "Edit Profile"
- [ ] Update name
- [ ] Update phone (optional)
- [ ] Save changes
- [ ] Verify updates reflected

#### Profile Statistics
- [ ] Navigate to detailed stats
- [ ] Verify all metrics displayed
- [ ] Check quiz creation stats
- [ ] Check quiz taking stats
- [ ] Review performance metrics

**Edge Cases:**
- [ ] Try empty name
- [ ] Invalid phone format
- [ ] Cancel edit (no changes)

---

### 6. Admin Panel (Admin Only)

#### Admin Dashboard
- [ ] Login as admin
- [ ] Navigate to `/admin/dashboard`
- [ ] Verify platform stats displayed
- [ ] Check quick action buttons

#### User Management
- [ ] Navigate to `/admin/users`
- [ ] View users list
- [ ] Search for user
- [ ] Change user role
- [ ] Disable/enable user
- [ ] Delete user (with confirmation)

#### Quiz Management
- [ ] Navigate to `/admin/quizzes`
- [ ] View all quizzes
- [ ] Search quizzes
- [ ] View quiz details
- [ ] Delete quiz
- [ ] Verify permanent delete option

**Edge Cases:**
- [ ] Try accessing admin as regular user
- [ ] Delete user with quizzes
- [ ] Delete quiz with attempts

---

### 7. UI/UX Features

#### Dark Mode
- [ ] Click theme toggle
- [ ] Verify theme switches
- [ ] Check all pages in dark mode
- [ ] Reload page (preference persists)
- [ ] Toggle back to light mode

#### Animations
- [ ] Page transitions smooth
- [ ] Button hover effects
- [ ] Card hover animations
- [ ] Loading animations display
- [ ] Error/success animations

#### Error Handling
- [ ] Trigger network error
- [ ] Verify error screen displays
- [ ] Click retry button
- [ ] Test "Go Home" button
- [ ] Check empty state displays

#### Notifications (Toasts)
- [ ] Success toast on successful action
- [ ] Error toast on failed action
- [ ] Toast auto-dismisses
- [ ] Multiple toasts stack correctly

---

## Browser Compatibility

### Test on Each Browser

#### Chrome (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Responsive design correct

#### Firefox (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Responsive design correct

#### Safari (Latest - macOS/iOS)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Touch interactions work (iOS)

#### Edge (Latest)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Responsive design correct

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Skip to content link works
- [ ] Modal focus trap works
- [ ] Escape key closes modals
- [ ] Enter/Space activates buttons

### Screen Reader Testing
- [ ] Run with NVDA/JAWS (Windows)
- [ ] Run with VoiceOver (macOS/iOS)
- [ ] All images have alt text
- [ ] Form labels read correctly
- [ ] Buttons have descriptive text
- [ ] ARIA labels present

### Color Contrast
- [ ] Text has sufficient contrast
- [ ] Buttons visible in both themes
- [ ] Links distinguishable
- [ ] Error messages readable
- [ ] Disabled states clear

### Reduced Motion
- [ ] Enable "Reduce Motion" in OS
- [ ] Animations reduced/disabled
- [ ] App still functional
- [ ] No motion sickness triggers

---

## Performance Testing

### Load Time
- [ ] Initial page load < 3s
- [ ] Subsequent pages < 1s
- [ ] Assets load efficiently
- [ ] No render blocking

### Bundle Size
```bash
npm run build
# Check dist/ folder size
```
- [ ] Main bundle < 1MB
- [ ] Gzipped size < 300KB
- [ ] No duplicate dependencies

### Network Performance
- [ ] Test on slow 3G
- [ ] Test on 4G
- [ ] Test on WiFi
- [ ] API requests optimized
- [ ] Images optimized

### Memory Usage
- [ ] No memory leaks
- [ ] Clean component unmounts
- [ ] Event listeners cleaned up
- [ ] AbortController cancels requests

---

## Responsive Design Testing

### Mobile (< 768px)
- [ ] All pages display correctly
- [ ] Touch targets adequate (44x44px)
- [ ] Text readable without zoom
- [ ] No horizontal scroll
- [ ] Forms usable
- [ ] Navigation accessible

### Tablet (768px - 1024px)
- [ ] Layout adapts appropriately
- [ ] Content not cramped
- [ ] Touch interactions work
- [ ] Orientation changes handled

### Desktop (> 1024px)
- [ ] Full layout displayed
- [ ] Content centered appropriately
- [ ] Hover states work
- [ ] Mouse interactions smooth

### Test Devices
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop 1080p (1920px)
- [ ] Desktop 4K (3840px)

---

## Bug Reporting

### Bug Report Template
```markdown
**Title**: Brief description

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 1920x1080
- Device: Desktop

**Steps to Reproduce**:
1. Navigate to...
2. Click on...
3. Enter...
4. Observe...

**Expected Behavior**:
Description of what should happen

**Actual Behavior**:
Description of what actually happens

**Screenshots**:
[Attach screenshots if applicable]

**Console Errors**:
```
[Paste any console errors]
```

**Additional Context**:
Any other relevant information
```

### Severity Levels
- **Critical**: App crashes, data loss, security issue
- **High**: Major feature broken, many users affected
- **Medium**: Feature partially broken, workaround exists
- **Low**: Minor visual issue, edge case

---

## Testing Checklist Summary

### Core Functionality
- [ ] Authentication (signup, login, logout)
- [ ] Quiz creation and editing
- [ ] Quiz taking and submission
- [ ] Search and discovery
- [ ] Profile management
- [ ] Admin panel (if admin)

### UI/UX
- [ ] Dark mode toggle
- [ ] Animations smooth
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications
- [ ] Empty states

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Reduced motion support

### Responsive Design
- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout
- [ ] Touch interactions
- [ ] Orientation changes

### Performance
- [ ] Load times acceptable
- [ ] Bundle size reasonable
- [ ] No memory leaks
- [ ] Network efficient

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## Testing Tools

### Recommended Tools
- **Browser DevTools**: Chrome/Firefox DevTools
- **Lighthouse**: Performance and accessibility auditing
- **WAVE**: Accessibility testing
- **axe DevTools**: Accessibility testing
- **React DevTools**: Component inspection
- **Redux DevTools**: State inspection (if using Redux)

### Online Tools
- **BrowserStack**: Cross-browser testing
- **LambdaTest**: Cross-browser testing
- **GTmetrix**: Performance testing
- **WebPageTest**: Performance testing

---

## Continuous Testing

### Before Each Commit
- [ ] Run build successfully
- [ ] No console errors
- [ ] Basic functionality works
- [ ] No new lint warnings

### Before Each Release
- [ ] Complete full testing checklist
- [ ] Test on all browsers
- [ ] Test all user flows
- [ ] Verify accessibility
- [ ] Check performance metrics

---

**Last Updated**: Phase 9 - Testing & Bug Fixes
