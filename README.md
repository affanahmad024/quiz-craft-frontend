# QuizCraft Frontend

**Create Engaging Quizzes, Learn & Grow**

QuizCraft is a modern quiz creation and management platform built with React, Material-UI, and following enterprise-grade architectural patterns from the Phoenix application.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development URL**: http://localhost:5173

---

## 📋 Project Status

### ✅ Phase 1: Foundation Setup - COMPLETE
- Complete folder structure following Phoenix patterns
- All dependencies installed and configured
- MUI theme matching QuizCraft design
- Network layer with Axios wrapper
- Utility functions and custom hooks
- Base atomic components
- Environment configuration

**See**: [docs/PHASE1_COMPLETE.md](docs/PHASE1_COMPLETE.md) for details

### 🔄 Current Phase: Phase 2 - Authentication (Next)

### 📖 Documentation
- **Implementation Guide**: [docs/IMPLEMENTATION_APPROACH.md](docs/IMPLEMENTATION_APPROACH.md)
- **Backend API**: [docs/FRONTEND_INTEGRATION_GUIDE.md](docs/FRONTEND_INTEGRATION_GUIDE.md)

---

## 🏗️ Architecture

### Tech Stack
- **React 19.2.0** - UI Framework
- **React Router DOM 7.x** - Routing
- **Material-UI 7.x** - Component Library
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **DayJS** - Date Manipulation
- **React Hot Toast** - Notifications
- **Vite 7.x** - Build Tool

### Design Pattern: Phoenix Architecture
Following proven patterns from Phoenix application:
- **Feature-First Organization**
- **Context-Based State Management**
- **Service Layer Abstraction**
- **Component Composition**
- **PropTypes Validation**

---

## 📁 Project Structure

```
src/
├── api/              # API endpoint definitions
├── components/       # Reusable UI components
├── constants/        # Application constants
├── contexts/         # React Context providers
├── funcs/            # Utility functions
├── hooks/            # Custom React hooks
├── guards/           # Route guards
├── layout/           # Layout components
├── routes/           # Route definitions
├── screens/          # Feature screens
├── services/         # API service layer
└── styles/           # Global styles & theme
```

---

## 🎨 Design System

### Colors
- **Primary**: #6C5CE7 (Purple)
- **Secondary**: #00B894 (Green)
- **Success**: #00B894
- **Warning**: #FDCB6E
- **Error**: #FF6B6B

### Typography
- **Font**: Inter with Roboto fallback
- **Sizes**: Responsive scale from 0.75rem to 4rem

---

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables
- `.env.development` - Development configuration
- `.env.production` - Production configuration

### Key Features
- Hot Module Replacement (HMR)
- Code splitting
- Tree shaking
- PropTypes validation
- ESLint configuration

---

## 📦 Features (Planned)

### Phase 2: Authentication ⏳
- Login / Signup
- Email verification
- Password reset
- Protected routes

### Phase 3: Quiz Management ⏳
- Create quizzes
- Add questions
- Publish/unpublish
- Delete quizzes

### Phase 4: Quiz Taking ⏳
- Start quiz
- Answer questions
- Timer functionality
- View results

### Phase 5: Search & Discovery ⏳
- Browse public quizzes
- Search with filters
- Categories & tags

### Phase 6: User Profile ⏳
- User statistics
- Quiz analytics
- Activity history

---

## 🤝 Contributing

This project follows strict architectural patterns. Please review:
1. [docs/IMPLEMENTATION_APPROACH.md](docs/IMPLEMENTATION_APPROACH.md)
2. Phoenix app patterns
3. Code style guidelines

---

## 📄 License

Copyright © 2026 QuizCraft

---

## 🔗 Links

- **Backend API**: http://localhost:8080/api/v1
- **API Documentation**: [docs/FRONTEND_INTEGRATION_GUIDE.md](docs/FRONTEND_INTEGRATION_GUIDE.md)
- **Design File**: See `Quiz Craft.pdf`

---

**Built with ❤️ following Phoenix patterns**
