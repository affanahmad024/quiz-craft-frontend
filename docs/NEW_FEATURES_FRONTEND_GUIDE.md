# QuizCraft Frontend - New Features Integration Guide
## In-App Notifications, Live Sessions & Educator Features

**Version**: 1.0
**Last Updated**: January 28, 2026
**Status**: Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [In-App Notifications](#in-app-notifications)
3. [Live Quiz Sessions](#live-quiz-sessions)
4. [Educator Role & Follow System](#educator-role--follow-system)
5. [Complete App Flow](#complete-app-flow)
6. [Technical Implementation](#technical-implementation)
7. [UI/UX Guidelines](#uiux-guidelines)

---

## Overview

This guide details the frontend implementation approach for three major features:

### Feature Set
1. **In-App Notifications** - Real-time notification system with WebSocket support
2. **Live Quiz Sessions** - Real-time competitive quiz sessions with live leaderboards
3. **Educator Role & Follow System** - Educator profiles, follower management, and content discovery

### Technology Stack
- **UI Framework**: React + Material-UI
- **Animations**: Framer Motion + Custom CSS
- **State Management**: React Context + Custom Hooks
- **Real-time**: WebSocket connections
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6

---

## In-App Notifications

### Pages & Components to Create

#### 1. **NotificationBell Component** (Global - In Layout)
**Location**: `src/layout/NotificationBell.jsx`

**Features**:
- Bell icon in the app header with unread count badge
- Shows unread notification count (red badge)
- Animated pulse effect when new notification arrives
- Click to open notification dropdown/drawer
- Real-time updates via WebSocket

**UI Elements**:
```
┌─────────────────────────────────┐
│  QuizCraft Logo    [🔔 3]  👤   │  ← Header
└─────────────────────────────────┘
         ↓ Click bell
    ┌──────────────────┐
    │ Notifications    │
    │ ────────────────│
    │ 🟢 New Quiz     │
    │ 📘 Live Session │
    │ 👥 New Follower │
    │                 │
    │ [Mark All Read] │
    │ [View All]      │
    └──────────────────┘
```

**Implementation**:
```jsx
// Key features to implement
- Unread count badge (displays count from API)
- Dropdown/popover with recent notifications (last 5)
- "Mark all as read" button
- "View all" link to full notifications page
- WebSocket listener for real-time updates
- Animation when new notification arrives
```

---

#### 2. **Notifications Page** (Full-page view)
**Route**: `/notifications`
**Location**: `src/screens/Notifications/NotificationsPage.jsx`

**Features**:
- Paginated list of all notifications
- Filter by notification type (tabs)
- Mark individual/all as read
- Delete notifications
- Pull-to-refresh on mobile
- Empty state when no notifications

**UI Layout**:
```
┌────────────────────────────────────────┐
│          Notifications                  │
├────────────────────────────────────────┤
│  [All] [Quiz] [Sessions] [Followers]   │ ← Filter Tabs
├────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────┐        │
│  │ 🟢 NEW                     │        │
│  │ John Doe published new quiz│  [×]   │
│  │ "React Fundamentals"       │        │
│  │ 2 hours ago                │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ 📘 READ                    │        │
│  │ Live session starting soon │  [×]   │
│  │ "JavaScript Challenge"     │        │
│  │ Yesterday                  │        │
│  └────────────────────────────┘        │
│                                         │
│       [Load More]                       │
└────────────────────────────────────────┘
```

**Notification Types Display**:
- **new_quiz**: "🎯 [Educator Name] published a new quiz: [Quiz Title]"
- **live_session_scheduled**: "📅 Live session scheduled: [Session Title]"
- **live_session_starting**: "⏰ Starting soon: [Session Title] in 10 minutes!"
- **live_session_invitation**: "✉️ You're invited to [Session Title]"
- **new_follower**: "👤 [User Name] started following you"
- **system**: "📢 [System Message]"

**Features per Notification**:
- Click to navigate to related content (quiz, session, profile)
- Swipe to delete (mobile)
- Mark as read on click
- Timestamp (relative: "2 hours ago", "Yesterday")
- Visual distinction between read/unread

---

#### 3. **WebSocket Service** (Background)
**Location**: `src/services/notifications/websocketService.js`

**Features**:
- Establish WebSocket connection on login
- Auto-reconnect on disconnect (exponential backoff)
- Listen for real-time notifications
- Update notification badge count
- Show toast notification for new notifications
- Maintain connection state
- Disconnect on logout

**Connection Flow**:
```
User Login
    ↓
Establish WebSocket (/api/v1/notifications/ws)
    ↓
Listen for messages
    ↓
New Notification Received
    ↓
1. Show toast notification (bottom-right)
2. Update badge count
3. Play sound (optional)
4. Animate bell icon
```

**Toast Notification**:
```
┌─────────────────────────────┐
│ 🎯 New Quiz Published       │
│ John Doe published "React..." │
│ [View]              [×]      │
└─────────────────────────────┘
  ↑ Appears bottom-right, auto-dismiss in 5s
```

---

#### 4. **Notification Context**
**Location**: `src/contexts/NotificationContext.jsx`

**State Management**:
```javascript
const NotificationContext = {
  // State
  notifications: [],           // Array of notification objects
  unreadCount: 0,              // Unread count
  wsConnected: false,          // WebSocket connection status

  // Actions
  fetchNotifications(),        // Load notifications from API
  markAsRead(id),              // Mark single notification as read
  markAllAsRead(),             // Mark all as read
  deleteNotification(id),      // Delete notification
  connectWebSocket(),          // Establish WebSocket
  disconnectWebSocket(),       // Close WebSocket
}
```

---

#### 5. **API Integration**
**Location**: `src/api/notifications/`

**Endpoints to implement**:
```javascript
// GET /notifications - List notifications
export const getNotifications = (params) => {
  return axios.get('/api/v1/notifications', { params });
};

// GET /notifications/unread-count - Get unread count
export const getUnreadCount = () => {
  return axios.get('/api/v1/notifications/unread-count');
};

// PATCH /notifications/:id/read - Mark as read
export const markNotificationAsRead = (id) => {
  return axios.patch(`/api/v1/notifications/${id}/read`);
};

// PATCH /notifications/read-all - Mark all as read
export const markAllNotificationsAsRead = () => {
  return axios.patch('/api/v1/notifications/read-all');
};

// DELETE /notifications/:id - Delete notification
export const deleteNotification = (id) => {
  return axios.delete(`/api/v1/notifications/${id}`);
};
```

---

### User Flow: Notifications

```
┌─────────────────┐
│  User Dashboard │
└────────┬────────┘
         │
         │ New notification arrives (WebSocket)
         ↓
┌────────────────────┐
│  Bell icon pulses  │ ← Animated
│  Badge: [1]        │
└────────┬───────────┘
         │
         │ Click bell
         ↓
┌─────────────────────────┐
│  Notification Dropdown   │
│  - Recent 5 notifications│
│  - Mark all read button  │
│  - View all link         │
└────────┬────────────────┘
         │
         │ Click "View All"
         ↓
┌──────────────────────────┐
│  Notifications Page       │
│  - All notifications      │
│  - Filter by type         │
│  - Pagination             │
└───────────────────────────┘
```

---

## Live Quiz Sessions

### Pages & Components to Create

#### 1. **Live Sessions Discovery Page**
**Route**: `/live-sessions`
**Location**: `src/screens/LiveSessions/LiveSessionsPage.jsx`

**Features**:
- List of public live sessions (waiting & live)
- Filter by status: "Starting Soon", "Live Now", "Scheduled"
- Search sessions by title
- Join public session button
- Create new session button (for educators)
- Session card with participant count, schedule time

**UI Layout**:
```
┌────────────────────────────────────────┐
│          Live Quiz Sessions             │
│  [Create Session] ──────────────────── │
├────────────────────────────────────────┤
│  [Live Now] [Starting Soon] [Scheduled]│ ← Filter Tabs
├────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────┐        │
│  │ 🔴 LIVE                    │        │
│  │ JavaScript Challenge        │        │
│  │ by John Doe                │        │
│  │ 👥 42 participants         │        │
│  │ ⏱️ 10 questions • 30s each │        │
│  │                            │        │
│  │        [JOIN NOW]          │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ ⏰ STARTING IN 5 MIN       │        │
│  │ React Hooks Deep Dive       │        │
│  │ by Sarah Smith             │        │
│  │ 👥 12 participants         │        │
│  │                            │        │
│  │        [JOIN]              │        │
│  └────────────────────────────┘        │
└────────────────────────────────────────┘
```

---

#### 2. **Create Live Session Page**
**Route**: `/live-sessions/create`
**Location**: `src/screens/LiveSessions/CreateSessionPage.jsx`

**Features**:
- Select quiz from user's published quizzes
- Set session title and description
- Choose session type: Public or Private
- Set progression mode: Automatic or Manual
- Configure question timer (5-300 seconds)
- Schedule session or start immediately
- Set max participants (optional)
- Enable/disable discoverability
- Generate/view access code (for private sessions)

**UI Layout**:
```
┌────────────────────────────────────────┐
│      Create Live Quiz Session          │
├────────────────────────────────────────┤
│                                         │
│  Select Quiz:                           │
│  [Dropdown: My Published Quizzes]      │
│                                         │
│  Session Details:                       │
│  Title: [_____________________]        │
│  Description: [________________]       │
│                                         │
│  Session Type:                          │
│  ○ Public  ● Private                   │
│                                         │
│  Progression Mode:                      │
│  ● Automatic (Timer) ○ Manual          │
│                                         │
│  Question Timer: [30] seconds          │
│  [━━━━━━━━━●━━━━━━━━━━━━━━]          │
│  5s              300s                   │
│                                         │
│  Schedule:                              │
│  ○ Start Now                           │
│  ● Schedule: [Date] [Time]             │
│                                         │
│  Advanced Options:                      │
│  Max Participants: [100]               │
│  ☑ Discoverable in public list         │
│  ☐ Allow late join                     │
│  ☑ Show answers after each question    │
│                                         │
│        [Cancel]  [Create Session]      │
└────────────────────────────────────────┘
```

**Validation Rules**:
- Quiz must be selected
- Title required (max 255 chars)
- Timer between 5-300 seconds
- Schedule time must be in future

---

#### 3. **Live Session Waiting Room**
**Route**: `/live-sessions/:id/waiting`
**Location**: `src/screens/LiveSessions/WaitingRoomPage.jsx`

**Features**:
- Session details display
- Live participant count
- Participant list (avatars)
- Quiz preview (question count, duration)
- Countdown timer (if scheduled)
- Start button (for creator)
- Leave session button
- Chat/reactions (future enhancement)

**UI Layout**:
```
┌────────────────────────────────────────┐
│     JavaScript Challenge               │
│     Waiting for host to start...       │
├────────────────────────────────────────┤
│                                         │
│  📊 Quiz Details:                       │
│  • 10 Questions                         │
│  • 30 seconds per question              │
│  • Total time: ~5 minutes               │
│                                         │
│  👥 Participants (12):                  │
│  [👤][👤][👤][👤][👤][👤]             │
│  [👤][👤][👤][👤][👤][👤]             │
│  +View all                              │
│                                         │
│  ⏰ Starting in: 00:04:32               │
│                                         │
│  ┌──────────────────────────┐          │
│  │  Waiting for more players │          │
│  │         ...               │          │
│  └──────────────────────────┘          │
│                                         │
│        [Leave Session]                  │
│                                         │
│  Creator only:                          │
│        [START NOW]                      │
└────────────────────────────────────────┘
```

---

#### 4. **Live Session Active Page**
**Route**: `/live-sessions/:id/live`
**Location**: `src/screens/LiveSessions/LiveSessionPage.jsx`

**Features**:
- Current question display with timer
- Answer options (clickable)
- Progress indicator (question X of Y)
- Real-time leaderboard (side panel or toggle)
- Points earned feedback after each answer
- Rank updates in real-time
- Question explanations after answering
- Auto-advance to next question (automatic mode)

**UI Layout**:
```
┌─────────────────────────────────────────────────┐
│  Question 5/10          ⏱️ 00:23       Rank: #3 │
├─────────────────────────────────────────────────┤
│                                                  │
│  What is the output of console.log(typeof null)?│
│                                                  │
│  ┌──────────────────────────────────┐          │
│  │  A) "null"                        │          │
│  └──────────────────────────────────┘          │
│                                                  │
│  ┌──────────────────────────────────┐          │
│  │  B) "object"                      │ ← Selected│
│  └──────────────────────────────────┘          │
│                                                  │
│  ┌──────────────────────────────────┐          │
│  │  C) "undefined"                   │          │
│  └──────────────────────────────────┘          │
│                                                  │
│  ┌──────────────────────────────────┐          │
│  │  D) "number"                      │          │
│  └──────────────────────────────────┘          │
│                                                  │
│            [Submit Answer]                       │
│                                                  │
│  ────────────────────────────────────────       │
│  Leaderboard (Toggle):                           │
│  1. Alice - 950 pts                             │
│  2. Bob - 925 pts                               │
│  3. You - 850 pts                               │
│  4. Charlie - 800 pts                           │
└─────────────────────────────────────────────────┘
```

**After Answer Submission**:
```
┌─────────────────────────────────────────┐
│  ✅ Correct! +125 points                 │
│                                          │
│  Explanation: typeof null returns        │
│  "object" due to a legacy bug in         │
│  JavaScript.                             │
│                                          │
│  Your Score: 850 → 975                   │
│  Your Rank: #3 → #2                      │
│                                          │
│  Next question in 3...                   │
└─────────────────────────────────────────┘
```

---

#### 5. **Live Session Results Page**
**Route**: `/live-sessions/:id/results`
**Location**: `src/screens/LiveSessions/ResultsPage.jsx`

**Features**:
- Final ranking/position
- Total score and percentage
- Final leaderboard (top 10 + user position)
- Question-by-question breakdown
- Correct/incorrect answers shown
- Time taken per question
- Share results button
- View detailed analytics
- Retake quiz button

**UI Layout**:
```
┌────────────────────────────────────────┐
│     🎉 Session Complete!                │
├────────────────────────────────────────┤
│                                         │
│       Your Rank: #2 / 42               │
│       ────────────────────             │
│       Score: 975 / 1000                │
│       Accuracy: 97.5%                   │
│       Average Time: 15s/question        │
│                                         │
│  📊 Final Leaderboard:                  │
│  ┌──────────────────────────┐          │
│  │ 🥇 1. Alice    - 1000 pts │          │
│  │ 🥈 2. You      - 975 pts  │ ← You   │
│  │ 🥉 3. Bob      - 950 pts  │          │
│  │    4. Charlie  - 920 pts  │          │
│  │    5. David    - 890 pts  │          │
│  └──────────────────────────┘          │
│                                         │
│  📝 Your Performance:                   │
│  ✅ Correct: 9/10                       │
│  ❌ Incorrect: 1/10                     │
│                                         │
│  [View Detailed Breakdown]             │
│  [Share Results] [Back to Sessions]   │
└────────────────────────────────────────┘
```

**Detailed Breakdown** (expandable):
```
Question 1: ✅ Correct (+100 pts, 12s)
Question 2: ✅ Correct (+125 pts, 10s)
Question 3: ❌ Wrong (0 pts, 15s)
  Your answer: B) React
  Correct answer: A) Angular
...
```

---

#### 6. **My Sessions Page**
**Route**: `/my-sessions`
**Location**: `src/screens/LiveSessions/MySessionsPage.jsx`

**Features**:
- List of sessions created by user
- Filter by status: Waiting, Live, Completed
- Session statistics (participants, avg score)
- Edit/Delete session (if not started)
- View session results/analytics
- Duplicate session

**UI Layout**:
```
┌────────────────────────────────────────┐
│          My Live Sessions               │
│  [Create New Session] ────────────────│
├────────────────────────────────────────┤
│  [Active] [Scheduled] [Past]           │ ← Tabs
├────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────┐        │
│  │ 🔴 LIVE NOW                │        │
│  │ JavaScript Challenge        │        │
│  │ 👥 42 participants          │        │
│  │ Started: 5 min ago          │        │
│  │                            │        │
│  │  [View] [End Session]      │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ ⏰ SCHEDULED                │        │
│  │ React Hooks Deep Dive       │        │
│  │ 📅 Tomorrow 3:00 PM         │        │
│  │ Access Code: XYZ789         │        │
│  │                            │        │
│  │  [Edit] [Delete] [Share]   │        │
│  └────────────────────────────┘        │
└────────────────────────────────────────┘
```

---

#### 7. **Session Invitations Page**
**Route**: `/session-invitations`
**Location**: `src/screens/LiveSessions/InvitationsPage.jsx`

**Features**:
- List of private session invitations
- Invitation status (pending, accepted, declined)
- Session details preview
- Accept/Decline buttons
- Notification badge on invitations

---

#### 8. **Live Session WebSocket Service**
**Location**: `src/services/liveSession/websocketService.js`

**Features**:
- Connect to session WebSocket on join
- Listen for real-time events:
  - Session started
  - Question revealed
  - Timer updates (countdown)
  - Question auto-advance
  - Leaderboard updates
  - Participant joined/left
  - Session ended
- Disconnect on leave/session end

**Event Handlers**:
```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch(message.type) {
    case 'session_started':
      navigateToLiveSession();
      break;
    case 'question_revealed':
      displayQuestion(message.data);
      startTimer(message.data.timer_seconds);
      break;
    case 'timer_update':
      updateTimer(message.data.seconds_remaining);
      break;
    case 'question_auto_advance':
      moveToNextQuestion(message.data);
      break;
    case 'leaderboard_update':
      updateLeaderboard(message.data.leaderboard);
      break;
    case 'session_ended':
      navigateToResults();
      break;
  }
};
```

---

### User Flow: Live Sessions

**Participant Flow**:
```
Discovery Page
    ↓
Browse/Search Sessions
    ↓
Click "Join" on a session
    ↓
Waiting Room (if not started)
    ↓
Session Starts (WebSocket event)
    ↓
Live Session Page
    ↓ (For each question)
Read Question
    ↓
Select Answer
    ↓
Submit Answer
    ↓
See Result & Points Earned
    ↓
Auto-advance to Next Question
    ↓ (Repeat)
    ↓
Session Complete
    ↓
Results Page with Final Ranking
```

**Creator Flow**:
```
Create Session Page
    ↓
Select Quiz & Configure
    ↓
Create Session
    ↓
Share Access Code (if private)
    ↓
Waiting Room (monitoring participants)
    ↓
Click "Start Session"
    ↓
Monitor Live Session
    ↓
(Manual mode) Advance Questions
    ↓
End Session
    ↓
View Session Analytics
```

---

## Educator Role & Follow System

### Pages & Components to Create

#### 1. **Become Educator Page**
**Route**: `/become-educator`
**Location**: `src/screens/Educator/BecomeEducatorPage.jsx`

**Features**:
- Eligibility check (email verified + phone number)
- Educator benefits overview
- Profile setup form (bio, tagline, expertise)
- Terms and conditions
- Submit application (auto-approved if eligible)

**UI Layout**:
```
┌────────────────────────────────────────┐
│       Become an Educator                │
├────────────────────────────────────────┤
│                                         │
│  🎓 Benefits of Being an Educator:      │
│  • Build your teaching brand            │
│  • Gain followers                       │
│  • Share your knowledge                 │
│  • Track engagement analytics           │
│                                         │
│  📋 Requirements:                        │
│  ✅ Verified email                      │
│  ✅ Phone number added                  │
│                                         │
│  ──────────────────────────────        │
│  Setup Your Profile:                    │
│                                         │
│  Tagline: [____________________]       │
│  (Brief description, max 100 chars)     │
│                                         │
│  Bio: [_______________________]        │
│       [_______________________]        │
│  (Tell students about yourself)         │
│                                         │
│  Expertise Areas:                       │
│  [+] JavaScript [+] React [+] Node.js  │
│  [Add more...]                          │
│                                         │
│  ☑ I agree to Educator Terms            │
│                                         │
│        [Cancel]  [Become Educator]      │
└────────────────────────────────────────┘
```

**Error Handling**:
```
If email not verified:
┌─────────────────────────────┐
│ ⚠️ Email Not Verified        │
│                              │
│ Please verify your email     │
│ before becoming an educator. │
│                              │
│   [Go to Profile Settings]   │
└─────────────────────────────┘

If phone not added:
┌─────────────────────────────┐
│ ⚠️ Phone Number Required     │
│                              │
│ Please add a phone number    │
│ to your profile.             │
│                              │
│   [Add Phone Number]         │
└─────────────────────────────┘
```

---

#### 2. **Educator Profile Page (Public)**
**Route**: `/educators/:id`
**Location**: `src/screens/Educator/EducatorProfilePage.jsx`

**Features**:
- Educator info (avatar, name, tagline, bio)
- Follow/Unfollow button
- Follower count
- Total quizzes created
- Average rating
- Expertise areas (tags)
- Social links
- List of educator's published quizzes
- Achievements/badges (if any)

**UI Layout**:
```
┌────────────────────────────────────────┐
│    ┌────┐                              │
│    │ 👤 │  John Doe                    │
│    └────┘  ⭐⭐⭐⭐⭐ (4.8/5)          │
│            Making coding fun!          │
│                                         │
│  👥 1,250 followers • 45 quizzes       │
│                                         │
│        [✅ Following] [Message]         │
│                                         │
│  ──────────────────────────────        │
│  About:                                 │
│  Experienced JavaScript developer       │
│  with 10 years of teaching experience.  │
│  Passionate about making complex        │
│  concepts easy to understand.           │
│                                         │
│  Expertise:                             │
│  [JavaScript] [React] [Node.js]        │
│  [TypeScript] [Testing]                 │
│                                         │
│  Credentials:                           │
│  • Certified JavaScript Developer       │
│  • 10+ years experience                 │
│                                         │
│  Links:                                 │
│  🔗 johndoe.dev                         │
│  🐦 @johndoe                            │
│  💼 linkedin.com/in/johndoe             │
│                                         │
│  ──────────────────────────────        │
│  📚 Published Quizzes:                  │
│                                         │
│  [Quiz Card 1]  [Quiz Card 2]          │
│  [Quiz Card 3]  [Quiz Card 4]          │
│                                         │
│       [Load More Quizzes]               │
└────────────────────────────────────────┘
```

**Follow Button States**:
- Not following: `[+ Follow]`
- Following: `[✅ Following]`
- Hover on following: `[Unfollow]` (red)

---

#### 3. **My Educator Profile Page**
**Route**: `/educator/profile`
**Location**: `src/screens/Educator/MyEducatorProfilePage.jsx`

**Features**:
- View own profile (same layout as public)
- Edit profile button
- Follower statistics dashboard
- Recent follower activity
- Quiz performance metrics
- Growth trends chart

**UI Layout**:
```
┌────────────────────────────────────────┐
│    My Educator Profile                  │
│                      [Edit Profile]     │
├────────────────────────────────────────┤
│  📊 Statistics:                         │
│  ┌─────────┬─────────┬─────────┐      │
│  │ 1,250   │   45    │  4.8    │      │
│  │Followers│ Quizzes │ Rating  │      │
│  └─────────┴─────────┴─────────┘      │
│                                         │
│  📈 Growth (Last 30 Days):              │
│  New Followers: +87                     │
│  [Line Chart: Follower Growth]         │
│                                         │
│  👥 Recent Followers:                   │
│  • Alice Smith - 2 hours ago            │
│  • Bob Johnson - 5 hours ago            │
│  • Carol White - Yesterday              │
│  [View All Followers]                   │
│                                         │
│  📚 Quiz Performance:                   │
│  • Total Attempts: 2,340                │
│  • Average Score: 78.5%                 │
│  • Most Popular: "React Hooks"          │
│                                         │
│  [View Full Profile] [Edit Profile]    │
└────────────────────────────────────────┘
```

---

#### 4. **Edit Educator Profile Page**
**Route**: `/educator/profile/edit`
**Location**: `src/screens/Educator/EditEducatorProfilePage.jsx`

**Features**:
- Update bio and tagline
- Manage expertise areas
- Add/update credentials
- Update social links
- Upload profile banner
- Save changes

**UI Layout**:
```
┌────────────────────────────────────────┐
│       Edit Educator Profile             │
├────────────────────────────────────────┤
│                                         │
│  Profile Banner:                        │
│  [Upload Banner Image]                  │
│  ┌────────────────────────────┐        │
│  │     Current Banner         │        │
│  └────────────────────────────┘        │
│                                         │
│  Tagline: [____________________]       │
│                                         │
│  Bio: [_______________________]        │
│       [_______________________]        │
│                                         │
│  Expertise Areas:                       │
│  [JavaScript ×] [React ×] [Node.js ×] │
│  [Add new expertise area...]            │
│                                         │
│  Credentials:                           │
│  • [Certified JavaScript Developer ×]   │
│  • [10+ years experience ×]             │
│  [Add credential...]                    │
│                                         │
│  Social Links:                          │
│  Website: [____________________]       │
│  Twitter: [____________________]       │
│  LinkedIn: [___________________]       │
│  GitHub: [_____________________]       │
│                                         │
│        [Cancel]  [Save Changes]        │
└────────────────────────────────────────┘
```

---

#### 5. **Educators Discovery Page**
**Route**: `/educators`
**Location**: `src/screens/Educator/EducatorsPage.jsx`

**Features**:
- List of all educators (sorted by followers)
- Search educators by name or expertise
- Filter by expertise area
- Featured educators section
- Verified educators badge
- Follow/Unfollow directly from list

**UI Layout**:
```
┌────────────────────────────────────────┐
│          Discover Educators             │
├────────────────────────────────────────┤
│  🔍 [Search educators...]               │
│                                         │
│  Filter by Expertise:                   │
│  [All] [JavaScript] [React] [Python]   │
│                                         │
│  ⭐ Featured Educators:                 │
│  ┌────────────────┐ ┌────────────────┐│
│  │ Jane Doe    ✓  │ │ Mike Smith  ✓  ││
│  │ 5K followers   │ │ 3K followers   ││
│  │ [+ Follow]     │ │ [Following ✓]  ││
│  └────────────────┘ └────────────────┘│
│                                         │
│  All Educators:                         │
│  ┌────────────────────────────┐        │
│  │ 👤 John Doe            ✓    │        │
│  │    JavaScript Expert        │        │
│  │    👥 1.2K • 📚 45 quizzes  │        │
│  │              [+ Follow]     │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 Sarah Johnson            │        │
│  │    React Specialist         │        │
│  │    👥 980 • 📚 32 quizzes   │        │
│  │              [Following ✓]  │        │
│  └────────────────────────────┘        │
│                                         │
│       [Load More]                       │
└────────────────────────────────────────┘
```

**Badges**:
- ✓ Verified (checkmark badge)
- ⭐ Featured (star badge)

---

#### 6. **Following Page**
**Route**: `/following`
**Location**: `src/screens/Educator/FollowingPage.jsx`

**Features**:
- List of educators user is following
- Quick unfollow action
- Latest quiz from each educator
- Activity feed (recent quizzes published)

**UI Layout**:
```
┌────────────────────────────────────────┐
│          Following (15)                 │
├────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 John Doe                 │        │
│  │    JavaScript Expert        │        │
│  │    👥 1.2K followers         │        │
│  │                            │        │
│  │    Latest Quiz:             │        │
│  │    "React Hooks" - 2h ago   │        │
│  │                            │        │
│  │    [View Profile] [Unfollow]│        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 Sarah Johnson            │        │
│  │    React Specialist         │        │
│  │    👥 980 followers          │        │
│  │                            │        │
│  │    Latest Quiz:             │        │
│  │    "State Management" - 1d  │        │
│  │                            │        │
│  │    [View Profile] [Unfollow]│        │
│  └────────────────────────────┘        │
│                                         │
│  📰 Recent Activity:                    │
│  • John Doe published "Node.js Basics"  │
│  • Sarah Johnson published "Redux"      │
│  • Mike Smith published "TypeScript"    │
│                                         │
└────────────────────────────────────────┘
```

---

#### 7. **Followers Page** (Educators Only)
**Route**: `/educator/followers`
**Location**: `src/screens/Educator/FollowersPage.jsx`

**Features**:
- List of users following the educator
- Follower avatars and names
- When they followed
- Filter by recent followers
- Export followers list (CSV)

**UI Layout**:
```
┌────────────────────────────────────────┐
│          My Followers (1,250)           │
│                        [Export CSV]     │
├────────────────────────────────────────┤
│  [All] [Recent] [This Week] [This Month]│
├────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 Alice Smith              │        │
│  │    Followed 2 hours ago     │        │
│  │    [View Profile]           │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 Bob Johnson              │        │
│  │    Followed yesterday       │        │
│  │    [View Profile]           │        │
│  └────────────────────────────┘        │
│                                         │
│  ┌────────────────────────────┐        │
│  │ 👤 Carol White              │        │
│  │    Followed 3 days ago      │        │
│  │    [View Profile]           │        │
│  └────────────────────────────┘        │
│                                         │
│       [Load More]                       │
└────────────────────────────────────────┘
```

---

#### 8. **Quiz Creation with Follower Notification**
**Enhancement to existing Create/Publish Quiz flow**

**When publishing a quiz**:
```
[Existing Publish Quiz Button]
    ↓ Click
┌─────────────────────────────┐
│ Publish Quiz                 │
│                              │
│ ☑ Notify my followers (1.2K) │
│                              │
│ Your followers will receive  │
│ a notification about this    │
│ new quiz.                    │
│                              │
│   [Cancel]  [Publish Now]    │
└─────────────────────────────┘
    ↓ Publish
Backend sends notifications to all followers
    ↓
Followers receive notification:
"🎯 John Doe published a new quiz: React Hooks"
```

---

### User Flow: Educator & Follow

**Becoming an Educator**:
```
User Dashboard
    ↓
Click "Become Educator"
    ↓
Check Eligibility
    ├─ Email Verified? ─ No → Verify Email First
    ├─ Phone Added? ─ No → Add Phone Number
    └─ Both Yes ↓
Setup Profile Form
    ↓
Submit
    ↓
Auto-Approved
    ↓
Educator Profile Created
    ↓
Redirect to Educator Dashboard
```

**Following an Educator**:
```
Browse Educators Page
    ↓
Search/Filter Educators
    ↓
View Educator Profile
    ↓
Click "Follow"
    ↓
Success Notification: "You're now following John Doe"
    ↓
Educator receives notification: "Alice started following you"
    ↓
User sees educator's quizzes in feed
    ↓
Get notified when educator publishes new quiz
```

**Educator Publishing Quiz**:
```
Create Quiz (Existing Flow)
    ↓
Publish Quiz Dialog
    ↓
☑ Notify Followers Checkbox (checked by default)
    ↓
Click "Publish"
    ↓
Backend:
  1. Publish quiz
  2. Create bulk notifications for all followers
  3. Send via WebSocket to online followers
    ↓
Followers:
  - Receive real-time notification
  - See notification in bell dropdown
  - Can click to view the quiz
```

---

## Complete App Flow

### Updated Navigation Menu

```
┌─────────────────────────────────────┐
│  QuizCraft Logo    [🔔 3]  [👤]     │ ← Header
└─────────────────────────────────────┘
         │
         ├─ Home
         ├─ Browse Quizzes
         ├─ My Quizzes
         ├─ 🆕 Live Sessions  ← NEW
         │     ├─ Discover Sessions
         │     ├─ Create Session
         │     ├─ My Sessions
         │     └─ Invitations
         ├─ 🆕 Educators  ← NEW
         │     ├─ Discover Educators
         │     ├─ Following
         │     └─ Become Educator
         ├─ 🆕 Notifications  ← NEW (also in bell)
         ├─ Profile
         └─ Settings
```

---

### Enhanced Dashboard

After integrating all features, the user dashboard will show:

```
┌────────────────────────────────────────┐
│          Welcome back, Alice!           │
├────────────────────────────────────────┤
│                                         │
│  🔴 Live Now (2):                       │
│  ┌─────────────────────┐               │
│  │ JavaScript Challenge │ [Join]        │
│  │ by John Doe • 42 👥  │               │
│  └─────────────────────┘               │
│                                         │
│  📢 Recent from Your Following:         │
│  • John Doe published "React Hooks"     │
│  • Sarah published "State Management"   │
│  [View All]                             │
│                                         │
│  ⭐ Recommended Quizzes:                │
│  [Quiz Card] [Quiz Card] [Quiz Card]   │
│                                         │
│  👥 Suggested Educators:                │
│  [Educator Card] [Educator Card]       │
│                                         │
│  📊 Your Stats:                         │
│  • Quizzes Taken: 45                    │
│  • Live Sessions: 12                    │
│  • Average Score: 85%                   │
│  • Current Streak: 5 days               │
└────────────────────────────────────────┘
```

---

## Technical Implementation

### Project Structure

```
src/
├── screens/
│   ├── Notifications/
│   │   ├── NotificationsPage.jsx
│   │   └── components/
│   │       ├── NotificationItem.jsx
│   │       └── NotificationFilter.jsx
│   │
│   ├── LiveSessions/
│   │   ├── LiveSessionsPage.jsx        # Discovery
│   │   ├── CreateSessionPage.jsx
│   │   ├── WaitingRoomPage.jsx
│   │   ├── LiveSessionPage.jsx         # Active session
│   │   ├── ResultsPage.jsx
│   │   ├── MySessionsPage.jsx
│   │   ├── InvitationsPage.jsx
│   │   └── components/
│   │       ├── SessionCard.jsx
│   │       ├── Leaderboard.jsx
│   │       ├── QuestionDisplay.jsx
│   │       ├── AnswerOption.jsx
│   │       ├── Timer.jsx
│   │       └── ParticipantList.jsx
│   │
│   └── Educator/
│       ├── BecomeEducatorPage.jsx
│       ├── EducatorProfilePage.jsx      # Public profile
│       ├── MyEducatorProfilePage.jsx    # Own profile
│       ├── EditEducatorProfilePage.jsx
│       ├── EducatorsPage.jsx            # Discovery
│       ├── FollowingPage.jsx
│       ├── FollowersPage.jsx
│       └── components/
│           ├── EducatorCard.jsx
│           ├── FollowButton.jsx
│           ├── EducatorStats.jsx
│           └── EducatorQuizList.jsx
│
├── layout/
│   ├── Header.jsx                       # Updated with NotificationBell
│   ├── NotificationBell.jsx             # NEW
│   ├── NotificationDropdown.jsx         # NEW
│   └── Sidebar.jsx                      # Updated navigation
│
├── components/
│   ├── notifications/
│   │   ├── NotificationToast.jsx        # Toast component
│   │   └── NotificationItem.jsx
│   │
│   ├── liveSession/
│   │   ├── SessionCard.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Timer.jsx
│   │   └── QuestionCard.jsx
│   │
│   └── educator/
│       ├── EducatorCard.jsx
│       ├── FollowButton.jsx
│       └── EducatorBadge.jsx
│
├── contexts/
│   ├── NotificationContext.jsx          # NEW
│   ├── LiveSessionContext.jsx           # NEW
│   └── EducatorContext.jsx              # NEW
│
├── services/
│   ├── notifications/
│   │   ├── notificationService.js
│   │   └── websocketService.js          # NEW
│   │
│   ├── liveSession/
│   │   ├── sessionService.js
│   │   └── websocketService.js          # NEW
│   │
│   └── educator/
│       ├── educatorService.js
│       └── followService.js
│
├── api/
│   ├── notifications/
│   │   └── index.js
│   │
│   ├── liveSession/
│   │   └── index.js
│   │
│   └── educator/
│       └── index.js
│
├── hooks/
│   ├── useNotifications.js
│   ├── useWebSocket.js
│   ├── useLiveSession.js
│   ├── useEducator.js
│   └── useFollow.js
│
└── routes/
    ├── notificationRoutes.jsx
    ├── liveSessionRoutes.jsx
    └── educatorRoutes.jsx
```

---

### Context API Structure

#### NotificationContext

```javascript
export const NotificationContext = createContext({
  // State
  notifications: [],
  unreadCount: 0,
  wsConnected: false,
  loading: false,

  // Actions
  fetchNotifications: async () => {},
  markAsRead: async (id) => {},
  markAllAsRead: async () => {},
  deleteNotification: async (id) => {},
  connectWebSocket: () => {},
  disconnectWebSocket: () => {},
});
```

#### LiveSessionContext

```javascript
export const LiveSessionContext = createContext({
  // State
  currentSession: null,
  participants: [],
  leaderboard: [],
  currentQuestion: null,
  timeRemaining: 0,
  userRank: null,
  userScore: 0,
  wsConnected: false,

  // Actions
  joinSession: async (sessionId, accessCode) => {},
  submitAnswer: async (questionId, answerId, timeTaken) => {},
  leaveSession: () => {},
  connectSessionWebSocket: (sessionId) => {},
  disconnectSessionWebSocket: () => {},
});
```

#### EducatorContext

```javascript
export const EducatorContext = createContext({
  // State
  educators: [],
  following: [],
  followers: [],
  myProfile: null,
  isEducator: false,
  loading: false,

  // Actions
  fetchEducators: async (params) => {},
  searchEducators: async (query) => {},
  followEducator: async (educatorId) => {},
  unfollowEducator: async (educatorId) => {},
  promoteToEducator: async (profileData) => {},
  updateProfile: async (updates) => {},
  fetchFollowers: async () => {},
  fetchFollowing: async () => {},
});
```

---

### Custom Hooks

#### useNotifications

```javascript
export const useNotifications = () => {
  const context = useContext(NotificationContext);

  const markAsReadAndNavigate = async (notification) => {
    await context.markAsRead(notification.id);

    // Navigate based on notification type
    switch(notification.type) {
      case 'new_quiz':
        navigate(`/quizzes/${notification.data.quiz_id}`);
        break;
      case 'live_session_starting':
        navigate(`/live-sessions/${notification.data.session_id}`);
        break;
      case 'new_follower':
        navigate(`/educator/followers`);
        break;
    }
  };

  return {
    ...context,
    markAsReadAndNavigate,
  };
};
```

#### useWebSocket

```javascript
export const useWebSocket = (url, onMessage) => {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    const token = getAccessToken();
    wsRef.current = new WebSocket(`${url}?token=${token}`);

    wsRef.current.onopen = () => setConnected(true);
    wsRef.current.onmessage = onMessage;
    wsRef.current.onclose = () => {
      setConnected(false);
      // Reconnect logic
      setTimeout(connect, 5000);
    };
  }, [url, onMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { connected, disconnect };
};
```

#### useLiveSession

```javascript
export const useLiveSession = (sessionId) => {
  const context = useContext(LiveSessionContext);
  const [answering, setAnswering] = useState(false);

  const submitAnswerWithFeedback = async (questionId, answerId, timeTaken) => {
    setAnswering(true);
    try {
      const result = await context.submitAnswer(questionId, answerId, timeTaken);

      // Show feedback toast
      showToast({
        message: result.is_correct ? '✅ Correct!' : '❌ Wrong',
        type: result.is_correct ? 'success' : 'error',
        points: result.points_earned,
      });

      return result;
    } finally {
      setAnswering(false);
    }
  };

  return {
    ...context,
    answering,
    submitAnswerWithFeedback,
  };
};
```

---

### WebSocket Implementation

#### Notification WebSocket

```javascript
// src/services/notifications/websocketService.js

class NotificationWebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(onMessage) {
    const token = getAccessToken();
    this.ws = new WebSocket(
      `ws://localhost:8080/api/v1/notifications/ws?token=${token}`
    );

    this.ws.onopen = () => {
      console.log('Notification WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      onMessage(notification);

      // Show toast notification
      this.showToast(notification);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect(onMessage);
    };
  }

  reconnect(onMessage) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect(onMessage);
      }, delay);
    }
  }

  showToast(notification) {
    // Show Material-UI Snackbar or custom toast
    toast({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      action: 'View',
      onAction: () => navigateToNotification(notification),
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new NotificationWebSocketService();
```

#### Live Session WebSocket

```javascript
// src/services/liveSession/websocketService.js

class LiveSessionWebSocketService {
  constructor() {
    this.ws = null;
    this.sessionId = null;
  }

  connect(sessionId, handlers) {
    this.sessionId = sessionId;
    const token = getAccessToken();

    this.ws = new WebSocket(
      `ws://localhost:8080/api/v1/live-sessions/${sessionId}/ws?token=${token}`
    );

    this.ws.onopen = () => {
      console.log('Live session WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message, handlers);
    };

    this.ws.onerror = (error) => {
      console.error('Session WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('Session WebSocket disconnected');
    };
  }

  handleMessage(message, handlers) {
    switch(message.type) {
      case 'session_started':
        handlers.onSessionStarted?.(message.data);
        break;
      case 'question_revealed':
        handlers.onQuestionRevealed?.(message.data);
        break;
      case 'timer_update':
        handlers.onTimerUpdate?.(message.data);
        break;
      case 'question_auto_advance':
        handlers.onQuestionAdvance?.(message.data);
        break;
      case 'leaderboard_update':
        handlers.onLeaderboardUpdate?.(message.data);
        break;
      case 'session_ended':
        handlers.onSessionEnded?.(message.data);
        break;
      case 'participant_joined':
        handlers.onParticipantJoined?.(message.data);
        break;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new LiveSessionWebSocketService();
```

---

### API Integration Examples

#### Notifications API

```javascript
// src/api/notifications/index.js
import axios from 'axios';

const BASE_URL = '/api/v1/notifications';

export const notificationAPI = {
  getNotifications: (params) => {
    return axios.get(BASE_URL, { params });
  },

  getUnreadCount: () => {
    return axios.get(`${BASE_URL}/unread-count`);
  },

  markAsRead: (id) => {
    return axios.patch(`${BASE_URL}/${id}/read`);
  },

  markAllAsRead: () => {
    return axios.patch(`${BASE_URL}/read-all`);
  },

  deleteNotification: (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
  },
};
```

#### Live Session API

```javascript
// src/api/liveSession/index.js
import axios from 'axios';

const BASE_URL = '/api/v1/live-sessions';

export const liveSessionAPI = {
  getPublicSessions: (params) => {
    return axios.get(`${BASE_URL}/public`, { params });
  },

  createSession: (data) => {
    return axios.post(BASE_URL, data);
  },

  getSession: (id) => {
    return axios.get(`${BASE_URL}/${id}`);
  },

  joinSession: (id, accessCode) => {
    return axios.post(`${BASE_URL}/${id}/join`, { access_code: accessCode });
  },

  submitAnswer: (id, data) => {
    return axios.post(`${BASE_URL}/${id}/answer`, data);
  },

  getLeaderboard: (id) => {
    return axios.get(`${BASE_URL}/${id}/leaderboard`);
  },

  getResults: (id) => {
    return axios.get(`${BASE_URL}/${id}/results`);
  },

  startSession: (id) => {
    return axios.post(`${BASE_URL}/${id}/start`);
  },

  endSession: (id) => {
    return axios.post(`${BASE_URL}/${id}/end`);
  },

  inviteUsers: (id, userIds) => {
    return axios.post(`${BASE_URL}/${id}/invite`, { user_ids: userIds });
  },
};
```

#### Educator API

```javascript
// src/api/educator/index.js
import axios from 'axios';

const BASE_URL = '/api/v1';

export const educatorAPI = {
  promoteToEducator: (data) => {
    return axios.post(`${BASE_URL}/educator/promote`, data);
  },

  getMyProfile: () => {
    return axios.get(`${BASE_URL}/educator/profile`);
  },

  updateProfile: (data) => {
    return axios.patch(`${BASE_URL}/educator/profile`, data);
  },

  getEducators: (params) => {
    return axios.get(`${BASE_URL}/educators`, { params });
  },

  searchEducators: (query) => {
    return axios.get(`${BASE_URL}/educators/search`, { params: { q: query } });
  },

  getEducatorProfile: (id) => {
    return axios.get(`${BASE_URL}/educators/${id}`);
  },

  followEducator: (id) => {
    return axios.post(`${BASE_URL}/educators/${id}/follow`);
  },

  unfollowEducator: (id) => {
    return axios.delete(`${BASE_URL}/educators/${id}/unfollow`);
  },

  getFollowing: (params) => {
    return axios.get(`${BASE_URL}/following`, { params });
  },

  getFollowers: (params) => {
    return axios.get(`${BASE_URL}/educator/followers`, { params });
  },

  getFollowerStats: () => {
    return axios.get(`${BASE_URL}/educator/followers/stats`);
  },
};
```

---

## UI/UX Guidelines

### Animation Guidelines

Use the existing animation system for consistency:

#### Notification Animations
```javascript
// Bell icon pulse when new notification
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 0.5 }}
>
  <NotificationBellIcon />
</motion.div>

// Notification item slide in
<motion.div
  initial={{ x: 300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -300, opacity: 0 }}
>
  <NotificationItem />
</motion.div>

// Toast notification
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 100, opacity: 0 }}
  className="animate-fade-in-up"
>
  <Toast />
</motion.div>
```

#### Live Session Animations
```javascript
// Question reveal
<motion.div
  variants={questionReveal}
  initial="initial"
  animate="animate"
  exit="exit"
>
  <QuestionCard />
</motion.div>

// Correct answer feedback
<motion.div
  variants={correctAnswer}
  className="animate-correct-answer"
>
  <AnswerOption />
</motion.div>

// Leaderboard update
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 0.3 }}
>
  <LeaderboardRank />
</motion.div>

// Timer warning (last 10 seconds)
<Typography
  className={timeRemaining < 10 ? 'animate-timer-warning' : ''}
>
  {timeRemaining}s
</Typography>
```

#### Educator Animations
```javascript
// Follow button success
<motion.button
  whileTap={{ scale: 0.95 }}
  animate={followed ? { scale: [1, 1.2, 1] } : {}}
>
  {followed ? '✓ Following' : 'Follow'}
</motion.button>

// Educator card hover
<AnimatedCard
  animateHover={true}
  animateTap={true}
>
  <EducatorCard />
</AnimatedCard>
```

---

### Color Palette

Follow the existing QuizCraft brand colors:

```css
/* Primary Green Gradient */
--primary-gradient: linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%);

/* Brand Colors */
--dark-green: #0D5C3F;
--medium-green: #159F5E;
--bright-green: #7ED957;

/* Notification Colors */
--unread-badge: #f44336;    /* Red */
--success: #4caf50;          /* Green */
--info: #2196f3;             /* Blue */
--warning: #ff9800;          /* Orange */

/* Live Session Colors */
--live-indicator: #f44336;   /* Red dot */
--starting-soon: #ff9800;    /* Orange */
--completed: #9e9e9e;        /* Gray */

/* Status Colors */
--correct: #4caf50;          /* Green */
--wrong: #f44336;            /* Red */
--pending: #ff9800;          /* Orange */
```

---

### Responsive Design

All new pages must be mobile-responsive:

**Breakpoints**:
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

**Mobile Optimizations**:
```javascript
// Use Material-UI responsive utilities
import { useMediaQuery, useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      padding: isMobile ? 2 : 4,
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* Content */}
    </Box>
  );
}
```

**Mobile-Specific Features**:
- Notification bell: Full-page drawer instead of dropdown
- Live session: Simplified leaderboard (collapsible)
- Educator list: Single column cards
- Swipe gestures for notifications

---

### Loading States

Use consistent loading indicators:

```javascript
// Full-page loading
<LoadingSpinner fullscreen message="Loading session..." />

// Inline loading
<LoadingDots size={12} />

// Skeleton loading for lists
<Skeleton variant="rectangular" width="100%" height={120} />
<Skeleton variant="text" />
<Skeleton variant="text" width="60%" />
```

---

### Error Handling

Display user-friendly error messages:

```javascript
// Error toast
toast.error('Failed to join session. Please try again.');

// Error page component
<Box sx={{ textAlign: 'center', p: 4 }}>
  <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
  <Typography variant="h5" sx={{ mt: 2 }}>
    Oops! Something went wrong
  </Typography>
  <Typography color="text.secondary">
    {errorMessage}
  </Typography>
  <Button variant="contained" onClick={retry} sx={{ mt: 2 }}>
    Try Again
  </Button>
</Box>
```

---

## Complete App Flow

### App After Integration

Once all three features are integrated, QuizCraft will offer:

#### 1. **Enhanced User Experience**

**For Students**:
- Discover and follow favorite educators
- Get real-time notifications about new quizzes
- Participate in live competitive quiz sessions
- View live rankings and compete with others
- Track performance across all activities

**For Educators**:
- Build a following and teaching brand
- Notify followers about new content
- Host live quiz sessions with real-time engagement
- Track follower growth and engagement
- View detailed analytics

#### 2. **Typical User Journey**

```
User logs in
    ↓
Dashboard shows:
  - Live sessions happening now
  - Recent quizzes from followed educators
  - Notifications (3 unread)
    ↓
User clicks notification bell
    ↓
Sees: "John Doe published React Hooks quiz"
    ↓
Clicks notification → Navigates to quiz
    ↓
Takes quiz
    ↓
Sees John Doe is hosting a live session
    ↓
Joins live session
    ↓
Competes in real-time with 42 others
    ↓
Finishes 2nd place
    ↓
Shares result on social media
    ↓
Discovers new educator from leaderboard
    ↓
Follows new educator
    ↓
Gets notified when they publish next quiz
```

#### 3. **Feature Integration Points**

**Notifications + Educators**:
- Receive notifications when followed educators publish quizzes
- Get notifications about new followers

**Notifications + Live Sessions**:
- Receive session starting reminders
- Get invited to private sessions via notifications
- Notified about session results

**Educators + Live Sessions**:
- Educators can create and host live sessions
- Followers get priority notifications about educator sessions
- Educator analytics include live session metrics

**All Three Combined**:
```
Educator creates quiz
    ↓
Publishes with "Notify followers" checked
    ↓
Backend sends notifications to 1,250 followers
    ↓
Real-time WebSocket delivers to online followers
    ↓
Followers see notification in bell
    ↓
Click notification → View quiz
    ↓
Educator schedules live session for quiz
    ↓
Followers get scheduled session notification
    ↓
10 minutes before: "Starting soon" notification
    ↓
Followers join live session
    ↓
Compete in real-time
    ↓
View results and share
```

---

## Testing Checklist

### Notifications
- [ ] Bell icon displays correct unread count
- [ ] Bell icon pulses on new notification
- [ ] Dropdown shows last 5 notifications
- [ ] Click notification navigates correctly
- [ ] Mark as read updates badge count
- [ ] Mark all as read works
- [ ] Delete notification removes it
- [ ] WebSocket connection established on login
- [ ] WebSocket reconnects on disconnect
- [ ] Toast appears for new notifications
- [ ] Notifications page pagination works
- [ ] Filter by type works correctly

### Live Sessions
- [ ] Public sessions list displays correctly
- [ ] Create session form validates inputs
- [ ] Private session generates access code
- [ ] Waiting room shows participants
- [ ] Countdown timer works
- [ ] WebSocket connects to session
- [ ] Question display updates in real-time
- [ ] Answer submission gives immediate feedback
- [ ] Timer counts down accurately
- [ ] Leaderboard updates in real-time
- [ ] Auto-advance works (automatic mode)
- [ ] Results page shows correct ranking
- [ ] Session invitations send notifications

### Educators
- [ ] Become educator checks eligibility
- [ ] Profile creation succeeds
- [ ] Follow button works
- [ ] Unfollow button works
- [ ] Follower count updates
- [ ] Following page lists correct educators
- [ ] Followers page shows all followers
- [ ] Search educators works
- [ ] Filter by expertise works
- [ ] Publishing quiz notifies followers
- [ ] Edit profile updates correctly
- [ ] Educator badges display correctly

---

## Performance Optimization

### Best Practices

1. **Lazy Loading**
```javascript
// Lazy load pages
const NotificationsPage = lazy(() => import('./screens/Notifications/NotificationsPage'));
const LiveSessionPage = lazy(() => import('./screens/LiveSessions/LiveSessionPage'));
```

2. **Memoization**
```javascript
// Memoize expensive components
const MemoizedLeaderboard = React.memo(Leaderboard);

// Memoize values
const sortedNotifications = useMemo(() => {
  return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}, [notifications]);
```

3. **Debouncing**
```javascript
// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce((query) => searchEducators(query), 500),
  []
);
```

4. **Pagination**
```javascript
// Implement infinite scroll for lists
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const newItems = await fetchNotifications({ page: page + 1 });
  setNotifications([...notifications, ...newItems]);
  setPage(page + 1);
  setHasMore(newItems.length > 0);
};
```

---

## Accessibility

### ARIA Labels

```jsx
// Notification bell
<IconButton
  aria-label={`${unreadCount} unread notifications`}
  aria-expanded={dropdownOpen}
>
  <Badge badgeContent={unreadCount}>
    <NotificationsIcon />
  </Badge>
</IconButton>

// Follow button
<Button
  aria-label={following ? 'Unfollow educator' : 'Follow educator'}
  aria-pressed={following}
>
  {following ? 'Following' : 'Follow'}
</Button>
```

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close dropdowns/modals
- Arrow keys for list navigation

### Screen Reader Support

```jsx
// Announce updates
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// Live session updates
<div role="status" aria-live="assertive">
  {timeRemaining < 10 ? `${timeRemaining} seconds remaining` : ''}
</div>
```

---

## Conclusion

After integrating all three features, QuizCraft becomes:

1. **More Engaging**: Real-time notifications and live sessions keep users active
2. **More Social**: Follow educators, compete with others, build community
3. **More Interactive**: Live sessions add excitement and real-time competition
4. **More Valuable for Educators**: Build following, engage students, track impact

### Key Success Metrics to Track

- Notification open rate
- Live session participation rate
- Educator follow/unfollow rate
- Active WebSocket connections
- Average session duration
- User retention (before vs after features)

---

**Document Version**: 1.0
**Last Updated**: January 28, 2026
**Status**: ✅ Ready for Implementation

---

## Next Steps for Implementation

1. Start with Notifications (foundational)
2. Then Live Sessions (most complex)
3. Finally Educators (builds on notifications)
4. Test integration between all three
5. Deploy incrementally with feature flags
6. Monitor metrics and gather feedback
7. Iterate based on user behavior

---

**Questions or Clarifications?**

If you have any doubts or need clarification on any aspect of this implementation guide, please ask! This is a comprehensive plan, and I can provide more details on specific components if needed.
