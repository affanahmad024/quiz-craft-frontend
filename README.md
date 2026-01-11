# QuizCraft Frontend

**Create Engaging Quizzes, Learn & Grow**

QuizCraft is a modern quiz creation and management platform built with React, Material-UI, and following enterprise-grade architectural patterns from the Phoenix application.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ or yarn 1.22+
- Backend API running (see backend documentation)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quiz-craft-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Configure environment variables
# Edit .env.development with your API URL
```

### Environment Configuration

Create `.env.development` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Development

```bash
# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📋 Project Status

### ✅ Completed Phases

1. **Phase 1: Foundation Setup** - Complete
   - Folder structure, dependencies, MUI theme
   - [Documentation](docs/PHASE1_COMPLETE.md)

2. **Phase 2: Authentication & Authorization** - Complete
   - Login, signup, email verification
   - Password reset, change password
   - JWT authentication with refresh tokens

3. **Phase 3: Quiz Management** - Complete
   - Create, edit, delete quizzes
   - Question management
   - Quiz publishing and sharing

4. **Phase 4: Quiz Taking & Attempts** - Complete
   - Quiz attempt flow
   - Answer submission
   - Results and scoring

5. **Phase 5: Search & Discovery** - Complete
   - Browse public quizzes
   - Search and filtering
   - Categories and tags

6. **Phase 6: User Profile & Statistics** - Complete
   - Profile management
   - User statistics
   - Performance tracking

7. **Phase 7: Admin Panel** - Complete
   - User management
   - Quiz moderation
   - Platform statistics

8. **Phase 8: Polish & Enhancement** - Complete
   - Animations and transitions
   - Dark mode support
   - Accessibility improvements
   - Responsive design
   - [Documentation](docs/PHASE8_COMPLETE.md)

### 🔄 Current Phase: Phase 9 - Testing & Bug Fixes

### 📖 Documentation
- **Implementation Guide**: [docs/IMPLEMENTATION_APPROACH.md](docs/IMPLEMENTATION_APPROACH.md)
- **Backend API**: [docs/FRONTEND_INTEGRATION_GUIDE.md](docs/FRONTEND_INTEGRATION_GUIDE.md)
- **Phase 8 Complete**: [docs/PHASE8_COMPLETE.md](docs/PHASE8_COMPLETE.md)

---

## 🏗️ Architecture

### Tech Stack
- **React 19** - UI Framework
- **React Router DOM 7** - Client-side routing
- **Material-UI 7** - Component library
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **DayJS** - Date manipulation
- **React Hot Toast** - Notifications
- **Vite 7** - Build tool and dev server

### Design Pattern: Phoenix Architecture
Following proven patterns from Phoenix application:
- **Feature-First Organization** - Group by feature, not file type
- **Context-Based State Management** - React Context for global state
- **Service Layer Abstraction** - Separate API logic from UI
- **Component Composition** - Reusable, composable components
- **PropTypes Validation** - Runtime type checking

---

## 📁 Project Structure

```
src/
├── api/                    # API endpoint definitions
│   ├── auth/              # Authentication endpoints
│   ├── quiz/              # Quiz endpoints
│   ├── attempt/           # Attempt endpoints
│   ├── discovery/         # Discovery endpoints
│   ├── profile/           # Profile endpoints
│   └── admin/             # Admin endpoints
│
├── components/            # Reusable components
│   ├── common/           # Common components (buttons, cards, etc.)
│   ├── screens/          # Screen-level components
│   ├── quiz/             # Quiz-related components
│   ├── attempt/          # Attempt-related components
│   └── profile/          # Profile-related components
│
├── constants/            # Application constants
│   ├── ApiConstants.js   # API configuration
│   ├── RouteConstants.js # Route paths
│   └── ColorConstants.js # Color palette
│
├── contexts/             # React Context providers
│   ├── auth/            # Authentication context
│   ├── quiz/            # Quiz management context
│   ├── attempt/         # Quiz attempt context
│   ├── discovery/       # Discovery context
│   ├── profile/         # Profile context
│   ├── admin/           # Admin context
│   └── theme/           # Theme mode context
│
├── guards/               # Route guards
│   ├── RequireAuth.jsx  # Protected route wrapper
│   ├── RequireGuest.jsx # Guest-only routes
│   ├── RequireVerified.jsx # Verified users only
│   └── RequireAdmin.jsx # Admin-only routes
│
├── hooks/                # Custom React hooks
│   └── useFetch.js      # Fetch hook with abort support
│
├── layouts/              # Page layouts
│   └── BasicLayout.jsx  # Standard layout with header
│
├── routes/               # Route configurations
│   ├── AuthRoutes.jsx   # Authentication routes
│   ├── QuizRoutes.jsx   # Quiz management routes
│   ├── AttemptRoutes.jsx # Quiz attempt routes
│   ├── DiscoveryRoutes.jsx # Discovery routes
│   ├── ProfileRoutes.jsx # Profile routes
│   └── AdminRoutes.jsx  # Admin routes
│
├── screens/              # Page components
│   ├── auth/            # Authentication screens
│   ├── quiz/            # Quiz management screens
│   ├── attempt/         # Quiz taking screens
│   ├── discovery/       # Discovery screens
│   ├── profile/         # Profile screens
│   └── admin/           # Admin screens
│
├── services/             # API service layer
│   ├── CommonFetch.js   # Fetch utility with error handling
│   ├── auth/            # Auth services
│   ├── quiz/            # Quiz services
│   ├── attempt/         # Attempt services
│   ├── discovery/       # Discovery services
│   ├── profile/         # Profile services
│   └── admin/           # Admin services
│
├── styles/               # Global styles
│   ├── theme.js         # MUI theme configuration
│   ├── variables.css    # CSS variables
│   └── global.css       # Global CSS styles
│
├── utils/                # Utility functions
│   ├── LocalStorageUtils.js # LocalStorage helpers
│   ├── ValidationUtils.js   # Form validation
│   ├── FormatUtils.js      # Data formatting
│   └── AccessibilityUtils.js # Accessibility helpers
│
├── funcs/                # Helper functions
│   ├── DateTimeFuncs.js # Date/time utilities
│   ├── TokenFuncs.js    # JWT token utilities
│   └── LSFuncs.js       # LocalStorage functions
│
├── App.jsx               # Root app component
└── main.jsx             # Entry point
```

---

## 🎨 Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ Login with JWT tokens
- ✅ Password reset flow
- ✅ Change password
- ✅ Protected routes
- ✅ Role-based access (admin/user)

### Quiz Management
- ✅ Create and edit quizzes
- ✅ Multiple question types (MCQ, True/False, Multiple Answer)
- ✅ Drag-and-drop question reordering
- ✅ Rich quiz metadata (title, description, category, difficulty)
- ✅ Quiz publishing and sharing
- ✅ Share code generation

### Quiz Taking
- ✅ Interactive quiz interface
- ✅ Progress tracking
- ✅ Timer support
- ✅ Answer review before submission
- ✅ Immediate results
- ✅ Detailed score breakdown

### Discovery & Search
- ✅ Browse public quizzes
- ✅ Search by title, category, tags
- ✅ Filter by difficulty
- ✅ Category organization
- ✅ Access via share code

### User Profile
- ✅ Profile management
- ✅ Comprehensive statistics
- ✅ Quiz creation history
- ✅ Attempt history
- ✅ Performance analytics

### Admin Panel
- ✅ User management
- ✅ Quiz moderation
- ✅ Platform statistics
- ✅ System monitoring

### UI/UX Enhancements
- ✅ Dark mode support
- ✅ Smooth animations (Framer Motion)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility features (WCAG 2.1 AA)
- ✅ Error boundaries
- ✅ Loading states
- ✅ Toast notifications
- ✅ Empty states

---

## 🎯 Key Components

### Animation Components
- **PageTransition** - Smooth page transitions
- **AnimatedButton** - Interactive buttons with hover/tap effects
- **AnimatedCard** - Cards with elevation animations
- **LoadingScreen** - Animated loading indicator

### Error Handling
- **ErrorBoundary** - Catches JavaScript errors
- **ErrorScreen** - Full-page error display with retry
- **EmptyState** - No data placeholder

### Layout & Navigation
- **BasicLayout** - Standard page layout
- **Header** - Navigation bar
- **ThemeToggle** - Dark/light mode switcher

### Theme
- **ThemeModeProvider** - Theme management
- **Custom MUI Theme** - Consistent design system

---

## 🔐 Authentication Flow

1. **Registration**: User signs up → Email verification sent
2. **Verification**: User clicks email link → Account activated
3. **Login**: User logs in → Access & Refresh tokens stored
4. **Protected Access**: Tokens validated on each request
5. **Token Refresh**: Automatic refresh token handling
6. **Logout**: Tokens cleared, user redirected

---

## 🛣️ Routing

### Public Routes
- `/` - Home page
- `/login` - Login
- `/signup` - Registration
- `/verify-email` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### Protected Routes (Authentication Required)
- `/dashboard` - User dashboard
- `/quizzes/*` - Quiz management
- `/attempts/*` - Quiz attempts
- `/discover/*` - Browse quizzes
- `/profile/*` - User profile

### Admin Routes (Admin Role Required)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/quizzes` - Quiz moderation

---

## 🎨 Theming

### Color Palette
```javascript
Primary: #6C5CE7 (Purple)
Secondary: #FD79A8 (Pink)
Success: #00B894 (Green)
Error: #FF6B6B (Red)
Warning: #FDCB6E (Yellow)
Info: #74B9FF (Blue)
```

### Dark Mode
- Automatic system preference detection
- Manual toggle with persistent preference
- Full theme support across all components

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Optimization
- Touch-friendly tap targets (44x44px minimum)
- Responsive typography
- Adaptive layouts
- Mobile-first approach

---

## ♿ Accessibility

### WCAG 2.1 Compliance
- Level A: ✅ Complete
- Level AA: ✅ Most requirements met
- Level AAA: ⚠️ Partial

### Features
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- ARIA labels
- Skip to content link
- Reduced motion support

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flows
- [ ] Quiz creation and editing
- [ ] Quiz taking and submission
- [ ] Search and discovery
- [ ] Profile management
- [ ] Admin features
- [ ] Dark mode switching
- [ ] Responsive layouts
- [ ] Error handling
- [ ] Accessibility features

---

## 🚀 Deployment

### Build
```bash
npm run build
```

Output: `dist/` directory

### Environment Variables (Production)
```env
VITE_API_BASE_URL=https://api.yourapp.com
```

### Hosting Options
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Build Optimization
- Code splitting (ready for React.lazy)
- Minification
- Tree shaking
- Gzip compression

---

## 🤝 Contributing

### Development Guidelines
1. Follow Phoenix architecture patterns
2. Use functional components with hooks
3. Add PropTypes validation
4. Write meaningful comments
5. Keep components small and focused
6. Test across browsers and devices

### Code Style
- ES6+ JavaScript
- JSX for components
- CSS-in-JS (MUI sx prop)
- Consistent naming conventions

---

## 📝 License

[Your License Here]

---

## 👥 Team

[Your Team Information]

---

## 📞 Support

For issues and questions:
- **GitHub Issues**: [Link to issues]
- **Email**: support@quizcraft.com
- **Documentation**: [Link to docs]

---

**Built with ❤️ using React, Material-UI, and modern web technologies**
