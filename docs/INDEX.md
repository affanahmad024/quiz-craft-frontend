# QuizCraft Frontend - Documentation Index

Complete guide to all documentation files and resources.

---

## 📚 Core Documentation

### [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
**Purpose**: Backend API Integration documentation
**Contents**:
- Complete API endpoint specifications
- Request/response formats for all endpoints
- Authentication flow and token management
- Error handling patterns
- Integration examples

**Read this if**: You need to understand how the frontend communicates with the backend API.

---

### [ANIMATIONS_GUIDE.md](ANIMATIONS_GUIDE.md)
**Purpose**: Animation system documentation
**Contents**:
- Framer Motion animation variants
- CSS animation classes and utilities
- Component-based animations (PageTransition, AnimatedCard, etc.)
- Loading animations (Spinner, Dots, Pulse)
- Quiz-specific animations (correct/wrong answers, progress bars, timers)
- Brand-themed green gradient effects matching the logo

**Read this if**: You want to add animations to your components or understand the animation system.

---

## 📋 Project Structure

```
quiz-craft-frontend/
├── docs/
│   ├── INDEX.md                          # This file
│   ├── FRONTEND_INTEGRATION_GUIDE.md     # API integration guide
│   └── ANIMATIONS_GUIDE.md               # Animation system guide
│
├── src/
│   ├── api/                              # API endpoint definitions
│   ├── components/
│   │   ├── animations/                   # Animation components
│   │   └── ...                           # Other reusable UI components
│   ├── constants/                        # Application constants
│   ├── contexts/                         # React Context providers
│   ├── funcs/                            # Utility functions
│   ├── guards/                           # Route guards
│   ├── hooks/                            # Custom React hooks
│   ├── layout/                           # Layout components
│   ├── routes/                           # Route definitions
│   ├── screens/                          # Feature screens
│   ├── services/                         # API service layer
│   └── styles/
│       ├── animations.js                 # Framer Motion variants
│       ├── animations.css                # CSS animations
│       ├── theme.js                      # MUI theme config
│       └── ...                           # Other styles
│
├── .env.example                          # Environment variable template
├── package.json                          # Dependencies and scripts
└── vite.config.js                        # Build configuration
```

---

## 🎯 Quick Reference

### "I need to integrate with the backend"
1. API Integration: [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
2. Service layer: Check `src/services/` directory
3. API endpoints: Check `src/api/` directory

### "I want to understand the project structure"
1. See the structure diagram above
2. Browse the `src/` directory with the structure in mind

### "I need to know which API endpoints are available"
1. Read [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
2. Check endpoint definitions in `src/api/` folders

### "I want to add animations to my components"
1. Read [ANIMATIONS_GUIDE.md](ANIMATIONS_GUIDE.md)
2. Import from `src/components/animations`
3. Use animation variants from `src/styles/animations.js`
4. Apply CSS classes from `src/styles/animations.css`

---

## 📞 Getting Help

### Common Questions

**Q: How do I integrate with the backend?**
A: See [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)

**Q: How is the code organized?**
A: See the project structure diagram above

**Q: Where are the API endpoints defined?**
A: In `src/api/` directory, organized by feature

**Q: Where are the screens/pages?**
A: In `src/screens/` directory, organized by feature

**Q: How do I add animations?**
A: See [ANIMATIONS_GUIDE.md](ANIMATIONS_GUIDE.md) for complete documentation

**Q: Where are the animation components?**
A: In `src/components/animations/` directory

---

## 🚀 Development Workflow

1. **Understand the API** - Read the FRONTEND_INTEGRATION_GUIDE.md
2. **Create API Endpoints** - Define endpoints in `src/api/[feature]/`
3. **Create Services** - Write service functions in `src/services/[feature]/`
4. **Create Contexts** - Add state management in `src/contexts/[feature]/`
5. **Build Screens** - Create screens in `src/screens/[feature]/`
6. **Add Routes** - Define routes in `src/routes/[feature]Routes.jsx`

---

**Last Updated**: January 2026
**Documentation Status**: ✅ Cleaned and Current
