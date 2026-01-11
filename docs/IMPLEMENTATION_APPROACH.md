# QuizCraft Frontend - Implementation Approach Document

**Version**: 1.0
**Last Updated**: January 11, 2026
**Status**: Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Core Patterns & Conventions](#core-patterns--conventions)
6. [Implementation Phases](#implementation-phases)
7. [Feature-by-Feature Implementation Guide](#feature-by-feature-implementation-guide)
8. [Development Guidelines](#development-guidelines)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

This document outlines the complete implementation approach for QuizCraft Frontend, following the proven architectural patterns from the Phoenix application. The implementation will be executed in **6 phases** over a structured timeline, ensuring quality, maintainability, and scalability.

### Key Principles

1. **Feature-First Organization** - Code organized by business domains (Auth, Quiz, Attempt, Admin)
2. **Phoenix Pattern Compliance** - Strict adherence to Phoenix app's proven patterns
3. **Context-Based State Management** - React Context API for shared state
4. **Service Layer Abstraction** - Clean separation between UI and API logic
5. **Component Composition** - Atomic design with reusable components
6. **Type Safety** - PropTypes validation for all components
7. **Error Resilience** - Comprehensive error handling with user-friendly notifications

---

## Technology Stack

### Core Framework & Build Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **React Router DOM** | 7.x | Client-side routing |
| **Vite** | 7.x | Build tool & dev server |
| **Axios** | Latest | HTTP client |

### UI Component Library

| Technology | Version | Purpose |
|------------|---------|---------|
| **Material-UI (MUI)** | 7.x | Component library |
| **@mui/icons-material** | 7.x | Icon library |
| **@mui/x-data-grid** | 8.x | Data tables |
| **@mui/x-date-pickers** | 8.x | Date/time pickers |

### State Management & Data Flow

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Context API** | Built-in | Global state management |
| **React Hooks** | Built-in | Local state & side effects |

### UX Enhancement

| Technology | Version | Purpose |
|------------|---------|---------|
| **Framer Motion** | 12.x | Animations & transitions |
| **react-hot-toast** | 2.x | Toast notifications |
| **Lottie React** | 2.x | Animated assets (loading, success) |
| **react-markdown** | Latest | Markdown rendering (explanations) |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **dayjs** | 1.11.x | Date manipulation |
| **prop-types** | Latest | Runtime type checking |
| **react-ga4** | 2.x | Google Analytics (optional) |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.x | Code linting |
| **Prettier** | Latest | Code formatting |
| **@vitejs/plugin-react** | 5.x | Vite React plugin |

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Screens, Components, Layouts)                         │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                 State Management Layer                   │
│  (React Context Providers, Custom Hooks)                │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    Service Layer                         │
│  (API Services, Business Logic)                         │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                      API Layer                           │
│  (Endpoint Definitions, HTTP Client)                    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   Backend REST API                       │
│  (http://localhost:8080/api/v1)                         │
└─────────────────────────────────────────────────────────┘
```

### Request Flow Pattern

```
User Action (Screen)
    ↓
Event Handler
    ↓
Context Action (optional)
    ↓
Service Function Call
    ↓
fetchWithAbort (with AbortController)
    ↓
useNetReq Hook (Axios wrapper)
    ↓
HTTP Request to Backend
    ↓
Response Handling
    ↓
State Update (Context/Local)
    ↓
UI Re-render
```

---

## Project Structure

### Directory Layout

```
quiz-craft-frontend/
│
├── public/                              # Static assets
│   ├── quiz-craft-env-config.js        # Runtime environment config
│   └── assets/                          # Images, icons, fonts
│
├── src/
│   │
│   ├── api/                             # API Endpoint Definitions
│   │   ├── APIMethods.js               # HTTP method constants
│   │   ├── auth/
│   │   │   └── AuthEndpoints.js        # Auth endpoints
│   │   ├── quiz/
│   │   │   ├── QuizEndpoints.js        # Quiz CRUD endpoints
│   │   │   ├── QuestionEndpoints.js    # Question CRUD endpoints
│   │   │   └── AnswerEndpoints.js      # Answer CRUD endpoints
│   │   ├── attempt/
│   │   │   └── AttemptEndpoints.js     # Quiz attempt endpoints
│   │   ├── user/
│   │   │   └── UserEndpoints.js        # User management endpoints
│   │   ├── search/
│   │   │   └── SearchEndpoints.js      # Search & discovery endpoints
│   │   ├── statistics/
│   │   │   └── StatisticsEndpoints.js  # Statistics endpoints
│   │   ├── admin/
│   │   │   └── AdminEndpoints.js       # Admin endpoints
│   │   └── ai/
│   │       └── AIEndpoints.js          # AI generation endpoints
│   │
│   ├── assets/                          # Images, animations, fonts
│   │   ├── images/
│   │   ├── animations/                  # Lottie files
│   │   └── fonts/
│   │
│   ├── components/                      # Reusable UI Components
│   │   ├── buttons/
│   │   │   ├── QuizCraftButton.jsx
│   │   │   ├── IconButton.jsx
│   │   │   └── LoadingButton.jsx
│   │   ├── cards/
│   │   │   ├── QuizCard.jsx
│   │   │   ├── AttemptCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── dialogs/
│   │   │   ├── QuizCraftDialog.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── DialogHeading.jsx
│   │   ├── forms/
│   │   │   ├── QuizForm.jsx
│   │   │   ├── QuestionForm.jsx
│   │   │   └── AnswerForm.jsx
│   │   ├── inputs/
│   │   │   ├── QuizCraftTextInput.jsx
│   │   │   ├── QuizCraftAutocomplete.jsx
│   │   │   ├── QuizCraftDatePicker.jsx
│   │   │   ├── QuizCraftSelect.jsx
│   │   │   ├── TagInput.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── display/
│   │   │   ├── InfoDataGrid.jsx
│   │   │   ├── InfoDataItem.jsx
│   │   │   ├── ScoreBadge.jsx
│   │   │   ├── DifficultyChip.jsx
│   │   │   └── CategoryChip.jsx
│   │   ├── navigation/
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── TabNavigation.jsx
│   │   ├── screens/
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── PageNotFound.jsx
│   │   │   ├── ErrorScreen.jsx
│   │   │   ├── WarningScreen.jsx
│   │   │   └── EmptyState.jsx
│   │   └── quiz/
│   │       ├── QuestionDisplay.jsx
│   │       ├── AnswerOption.jsx
│   │       ├── QuestionList.jsx
│   │       ├── QuizTimer.jsx
│   │       └── QuizProgress.jsx
│   │
│   ├── constants/                       # Application Constants
│   │   ├── AppConstants.js             # General app constants
│   │   ├── LSConstants.js              # LocalStorage keys
│   │   ├── RouteConstants.js           # Route paths
│   │   ├── QuizConstants.js            # Quiz-specific constants
│   │   └── ColorConstants.js           # Color palette
│   │
│   ├── contexts/                        # React Context Providers
│   │   ├── auth/
│   │   │   └── AuthContextProvider.jsx
│   │   ├── quiz/
│   │   │   ├── QuizListContextProvider.jsx
│   │   │   ├── QuizDetailContextProvider.jsx
│   │   │   └── QuizCreatorContextProvider.jsx
│   │   ├── attempt/
│   │   │   ├── AttemptContextProvider.jsx
│   │   │   └── AttemptListContextProvider.jsx
│   │   ├── user/
│   │   │   └── UserContextProvider.jsx
│   │   ├── search/
│   │   │   └── SearchContextProvider.jsx
│   │   └── utility/
│   │       └── UtilityContextWrapper.jsx
│   │
│   ├── funcs/                           # Utility Functions
│   │   ├── APIFuncs.js                 # URL composition, param replacement
│   │   ├── LSFuncs.js                  # LocalStorage helpers
│   │   ├── DateTimeFuncs.js            # Date formatting
│   │   ├── StringFuncs.js              # String manipulation
│   │   ├── ValidationFuncs.js          # Form validation
│   │   ├── ScoreFuncs.js               # Score calculations
│   │   ├── QuizFuncs.js                # Quiz-specific utilities
│   │   └── TokenFuncs.js               # JWT token helpers
│   │
│   ├── hooks/                           # Custom React Hooks
│   │   ├── NetworkRequest.js           # useNetReq - Axios wrapper
│   │   ├── useAuth.js                  # Authentication hook
│   │   ├── useLocalStorage.js          # LocalStorage hook
│   │   ├── useDebounce.js              # Debounce hook
│   │   ├── useTimer.js                 # Timer hook for quiz
│   │   └── useAbortController.js       # Request cancellation hook
│   │
│   ├── guards/                          # Route Guards
│   │   ├── RequireAuth.jsx             # Authentication guard
│   │   ├── RequireGuest.jsx            # Redirect if authenticated
│   │   ├── RequireVerified.jsx         # Email verification guard
│   │   └── RequireAdmin.jsx            # Admin role guard
│   │
│   ├── layout/                          # Layout Components
│   │   ├── BasicLayout.jsx             # Main app layout
│   │   ├── AuthLayout.jsx              # Auth pages layout
│   │   ├── Header.jsx                  # App header
│   │   ├── Footer.jsx                  # App footer
│   │   ├── Sidebar.jsx                 # Navigation sidebar
│   │   └── SetBrowserTabTitle.jsx      # Dynamic page title
│   │
│   ├── routes/                          # Route Definitions
│   │   ├── AuthRoutes.jsx              # Authentication routes
│   │   ├── QuizRoutes.jsx              # Quiz management routes
│   │   ├── AttemptRoutes.jsx           # Quiz attempt routes
│   │   ├── UserRoutes.jsx              # User profile routes
│   │   ├── SearchRoutes.jsx            # Search & discovery routes
│   │   ├── AdminRoutes.jsx             # Admin routes
│   │   └── index.js                    # Route aggregator
│   │
│   ├── screens/                         # Feature Screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── SignupScreen.jsx
│   │   │   ├── ForgotPasswordScreen.jsx
│   │   │   ├── ResetPasswordScreen.jsx
│   │   │   ├── VerifyEmailScreen.jsx
│   │   │   └── ChangePasswordScreen.jsx
│   │   ├── quiz/
│   │   │   ├── QuizListScreen.jsx      # My Quizzes
│   │   │   ├── QuizDetailScreen.jsx    # View quiz details
│   │   │   ├── QuizCreateScreen.jsx    # Create new quiz
│   │   │   ├── QuizEditScreen.jsx      # Edit quiz
│   │   │   ├── QuestionManageScreen.jsx # Manage questions
│   │   │   └── QuizStatsScreen.jsx     # Quiz statistics
│   │   ├── attempt/
│   │   │   ├── QuizTakeScreen.jsx      # Take quiz (in-progress)
│   │   │   ├── QuizStartScreen.jsx     # Quiz start page
│   │   │   ├── QuizResultScreen.jsx    # View results
│   │   │   └── AttemptListScreen.jsx   # My attempts
│   │   ├── search/
│   │   │   ├── DiscoverScreen.jsx      # Browse public quizzes
│   │   │   ├── SearchScreen.jsx        # Search interface
│   │   │   └── QuizDetailPublicScreen.jsx # Public quiz detail
│   │   ├── user/
│   │   │   ├── ProfileScreen.jsx       # User profile
│   │   │   ├── ProfileEditScreen.jsx   # Edit profile
│   │   │   └── StatisticsScreen.jsx    # User statistics
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagementScreen.jsx
│   │   │   ├── QuizManagementScreen.jsx
│   │   │   ├── PlatformStatsScreen.jsx
│   │   │   └── ActivityLogsScreen.jsx
│   │   ├── ai/
│   │   │   ├── AIGenerateScreen.jsx
│   │   │   └── GenerationJobsScreen.jsx
│   │   └── home/
│   │       ├── LandingScreen.jsx
│   │       └── DashboardScreen.jsx
│   │
│   ├── services/                        # API Service Layer
│   │   ├── CommonFetch.js              # Shared fetch utility
│   │   ├── auth/
│   │   │   └── AuthServices.js
│   │   ├── quiz/
│   │   │   ├── QuizServices.js
│   │   │   ├── QuestionServices.js
│   │   │   └── AnswerServices.js
│   │   ├── attempt/
│   │   │   └── AttemptServices.js
│   │   ├── user/
│   │   │   └── UserServices.js
│   │   ├── search/
│   │   │   └── SearchServices.js
│   │   ├── statistics/
│   │   │   └── StatisticsServices.js
│   │   ├── admin/
│   │   │   └── AdminServices.js
│   │   └── ai/
│   │       └── AIServices.js
│   │
│   ├── styles/                          # Global Styles
│   │   ├── global.css                  # Global CSS
│   │   ├── theme.js                    # MUI theme config
│   │   ├── variables.css               # CSS variables
│   │   └── animations.css              # Reusable animations
│   │
│   ├── App.jsx                          # Root component
│   ├── main.jsx                         # Entry point
│   └── index.css                        # Base styles
│
├── .env.development                     # Dev environment variables
├── .env.production                      # Production environment variables
├── .eslintrc.js                         # ESLint configuration
├── .prettierrc                          # Prettier configuration
├── vite.config.js                       # Vite configuration
├── package.json                         # Dependencies
└── README.md                            # Project documentation
```

---

## Core Patterns & Conventions

### 1. Naming Conventions

#### Files & Directories
- **React Components**: PascalCase (e.g., `QuizCard.jsx`, `LoginScreen.jsx`)
- **Utility Files**: camelCase (e.g., `apiFuncs.js`, `tokenFuncs.js`)
- **Context Providers**: `[Feature]ContextProvider.jsx` (e.g., `AuthContextProvider.jsx`)
- **Services**: `[Feature]Services.js` (e.g., `QuizServices.js`)
- **Endpoints**: `[Feature]Endpoints.js` (e.g., `QuizEndpoints.js`)
- **Hooks**: `use[HookName].js` (e.g., `useAuth.js`, `useNetReq.js`)

#### Variables & Functions
- **State Variables**: camelCase (e.g., `quizList`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_METHODS`, `LS_USER_DATA`)
- **Functions**: camelCase (e.g., `fetchQuizList`, `handleSubmit`)
- **Components**: PascalCase (e.g., `QuizCard`, `LoadingButton`)

### 2. API Integration Pattern

#### Endpoint Definition
```javascript
// src/api/quiz/QuizEndpoints.js
import { API_METHODS } from '../APIMethods';

export const QUIZ_ENDPOINTS = {
  // List my quizzes
  QUIZ_LIST: {
    url: 'quizzes?page=<page>&limit=<limit>',
    method: API_METHODS.GET,
  },

  // Get quiz by ID
  QUIZ_BY_ID: {
    url: 'quizzes/<id>',
    method: API_METHODS.GET,
  },

  // Get quiz with questions
  QUIZ_FULL: {
    url: 'quizzes/<id>/full',
    method: API_METHODS.GET,
  },

  // Create quiz
  QUIZ_CREATE: {
    url: 'quizzes',
    method: API_METHODS.POST,
  },

  // Update quiz
  QUIZ_UPDATE: {
    url: 'quizzes/<id>',
    method: API_METHODS.PATCH,
  },

  // Delete quiz
  QUIZ_DELETE: {
    url: 'quizzes/<id>',
    method: API_METHODS.DELETE,
  },

  // Publish quiz
  QUIZ_PUBLISH: {
    url: 'quizzes/<id>/publish',
    method: API_METHODS.POST,
  },

  // Unpublish quiz
  QUIZ_UNPUBLISH: {
    url: 'quizzes/<id>/unpublish',
    method: API_METHODS.POST,
  },
};
```

#### Service Function
```javascript
// src/services/quiz/QuizServices.js
import { QUIZ_ENDPOINTS } from '../../api/quiz/QuizEndpoints';
import { fetchWithAbort } from '../CommonFetch';

export const fetchQuizList = (
  fetchData,
  abortContRef,
  { page = 1, limit = 20 }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.QUIZ_LIST,
    urlKeys: { page, limit },
    defaultErrorMsg: "Couldn't fetch quiz list",
  });

export const fetchQuizById = (
  fetchData,
  abortContRef,
  { quizId }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.QUIZ_BY_ID,
    urlKeys: { id: quizId },
    defaultErrorMsg: "Couldn't fetch quiz details",
  });

export const createQuiz = (
  fetchData,
  abortContRef,
  { quizData }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.QUIZ_CREATE,
    payload: quizData,
    defaultErrorMsg: "Couldn't create quiz",
  });

export const updateQuiz = (
  fetchData,
  abortContRef,
  { quizId, quizData }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.QUIZ_UPDATE,
    urlKeys: { id: quizId },
    payload: quizData,
    defaultErrorMsg: "Couldn't update quiz",
  });

export const deleteQuiz = (
  fetchData,
  abortContRef,
  { quizId }
) =>
  fetchWithAbort({
    fetchData,
    abortContRef,
    endpoint: QUIZ_ENDPOINTS.QUIZ_DELETE,
    urlKeys: { id: quizId },
    defaultErrorMsg: "Couldn't delete quiz",
  });
```

#### Context Provider with Service Integration
```javascript
// src/contexts/quiz/QuizListContextProvider.jsx
import { createContext, useContext, useState, useRef } from 'react';
import { useNetReq } from '../../hooks/NetworkRequest';
import { fetchQuizList } from '../../services/quiz/QuizServices';
import PropTypes from 'prop-types';

const QuizListCtx = createContext();

function QuizListContextProvider({ children }) {
  const { fetchData } = useNetReq();
  const abortContRef = useRef(new AbortController());

  // State
  const [quizList, setQuizList] = useState([]);
  const [fetchingQuizList, setFetchingQuizList] = useState(true);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);

  // Fetch quiz list
  const loadQuizList = async (page = 1, limit = 20) => {
    setFetchingQuizList(true);

    const response = await fetchQuizList(
      fetchData,
      abortContRef,
      { page, limit }
    );

    if (response?.success) {
      setQuizList(response.data.quizzes || []);
      setTotalQuizzes(response.data.total || 0);
      setCurrentPage(page);
      setPageLimit(limit);
    }

    setFetchingQuizList(false);
  };

  const value = {
    quizList,
    setQuizList,
    fetchingQuizList,
    totalQuizzes,
    currentPage,
    pageLimit,
    loadQuizList,
  };

  return (
    <QuizListCtx.Provider value={value}>
      {children}
    </QuizListCtx.Provider>
  );
}

QuizListContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useQuizListCtx = () => useContext(QuizListCtx);

export { QuizListContextProvider, useQuizListCtx };
```

#### Screen Component Using Context
```javascript
// src/screens/quiz/QuizListScreen.jsx
import { useEffect } from 'react';
import { useQuizListCtx } from '../../contexts/quiz/QuizListContextProvider';
import QuizCard from '../../components/cards/QuizCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { Grid, Typography, Pagination } from '@mui/material';

function QuizListScreen() {
  const {
    quizList,
    fetchingQuizList,
    totalQuizzes,
    currentPage,
    pageLimit,
    loadQuizList,
  } = useQuizListCtx();

  useEffect(() => {
    loadQuizList();
  }, []);

  if (fetchingQuizList) {
    return <LoadingScreen />;
  }

  const totalPages = Math.ceil(totalQuizzes / pageLimit);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Quizzes
      </Typography>

      <Grid container spacing={3}>
        {quizList.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <QuizCard quiz={quiz} />
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => loadQuizList(page, pageLimit)}
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}

export default QuizListScreen;
```

### 3. Authentication Pattern

#### Auth Context Provider
```javascript
// src/contexts/auth/AuthContextProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNetReq } from '../../hooks/NetworkRequest';
import { fetchUserProfile } from '../../services/auth/AuthServices';
import { getFromLS, saveToLS, removeFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const AuthCtx = createContext();

function AuthContextProvider({ children }) {
  const { fetchData } = useNetReq();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    getFromLS(LS_CONSTS.LS_ACCESS_TOKEN)
  );
  const [refreshToken, setRefreshToken] = useState(
    getFromLS(LS_CONSTS.LS_REFRESH_TOKEN)
  );

  // Login function
  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    setIsAuthenticated(true);

    saveToLS(LS_CONSTS.LS_USER_DATA, userData);
    saveToLS(LS_CONSTS.LS_ACCESS_TOKEN, tokens.access_token);
    saveToLS(LS_CONSTS.LS_REFRESH_TOKEN, tokens.refresh_token);

    toast.success('Login successful!');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);

    removeFromLS(LS_CONSTS.LS_USER_DATA);
    removeFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
    removeFromLS(LS_CONSTS.LS_REFRESH_TOKEN);

    toast.success('Logged out successfully');
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
      const userData = getFromLS(LS_CONSTS.LS_USER_DATA);

      if (token && userData) {
        setAccessToken(token);
        setUser(userData);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthCtx);

export { AuthContextProvider, useAuth };
```

#### Route Guard
```javascript
// src/guards/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import LoadingScreen from '../components/screens/LoadingScreen';
import PropTypes from 'prop-types';

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
```

### 4. Common Fetch Utility

```javascript
// src/services/CommonFetch.js
import { replaceUrlParams, buildQueryString } from '../funcs/APIFuncs';
import toast from 'react-hot-toast';

export const fetchWithAbort = async ({
  fetchData,
  abortContRef,
  endpoint,
  urlKeys = {},
  dynamicQparams = null,
  onSuccess = undefined,
  onError = undefined,
  payload = null,
  defaultErrorMsg = null,
  showSuccessToast = false,
  successMsg = 'Operation successful',
  authRequired = true,
}) => {
  try {
    // Abort previous request
    if (abortContRef.current) {
      abortContRef.current.abort();
    }
    abortContRef.current = new AbortController();

    // Build URL
    let url = endpoint.url;

    // Replace URL parameters
    if (Object.keys(urlKeys).length > 0) {
      url = replaceUrlParams(url, urlKeys);
    }

    // Add query parameters
    if (dynamicQparams) {
      const queryString = buildQueryString(dynamicQparams);
      url = `${url}${queryString}`;
    }

    // Make request
    const response = await fetchData({
      url,
      method: endpoint.method,
      body: payload,
      authRequired,
      signal: abortContRef.current.signal,
    });

    // Handle success
    if (response?.data) {
      if (showSuccessToast) {
        toast.success(successMsg);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return { success: true, data: response.data };
    }

    // Handle error
    const errorMessage = response?.error?.message || defaultErrorMsg || 'An error occurred';
    toast.error(errorMessage);

    if (onError) {
      onError(response?.error);
    }

    return { success: false, error: response?.error };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
      return { success: false, aborted: true };
    }

    console.error('Fetch error:', error);
    const errorMsg = error.message || defaultErrorMsg || 'Network error occurred';
    toast.error(errorMsg);

    if (onError) {
      onError(error);
    }

    return { success: false, error };
  }
};
```

### 5. Network Request Hook

```javascript
// src/hooks/NetworkRequest.js
import { useState } from 'react';
import axios from 'axios';
import { getFromLS } from '../funcs/LSFuncs';
import { LS_CONSTS } from '../constants/LSConstants';

const useNetReq = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

  const fetchData = async ({
    url,
    method = 'GET',
    body = null,
    authRequired = true,
    customHeaders = {},
    responseType = 'json',
    timeout = 60000,
    signal = null,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Build headers
      const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      // Add auth token
      if (authRequired) {
        const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // Make request
      const config = {
        url: `${baseURL}/${url}`,
        method,
        headers,
        data: body,
        timeout,
        signal,
        responseType,
      };

      const response = await axios(config);

      setLoading(false);
      return { data: response.data };

    } catch (err) {
      setLoading(false);

      if (err.name === 'AbortError') {
        throw err;
      }

      const errorResponse = {
        error: {
          code: err.response?.data?.error?.code || 'unknown-error',
          message: err.response?.data?.error?.message || err.message,
          details: err.response?.data?.error?.details || {},
        },
      };

      setError(errorResponse.error);
      return errorResponse;
    }
  };

  return { loading, error, fetchData };
};

export default useNetReq;
```

### 6. Component Patterns

#### Atomic Component with PropTypes
```javascript
// src/components/buttons/QuizCraftButton.jsx
import { Button, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

function QuizCraftButton({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon = null,
  endIcon = null,
  size = 'medium',
  type = 'button',
  sx = {},
}) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
      endIcon={endIcon}
      size={size}
      type={type}
      sx={sx}
    >
      {children}
    </Button>
  );
}

QuizCraftButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  sx: PropTypes.object,
};

export default QuizCraftButton;
```

### 7. Error Handling Pattern

```javascript
// Error handling in screen component
import { useEffect, useState } from 'react';
import { useQuizListCtx } from '../../contexts/quiz/QuizListContextProvider';
import ErrorScreen from '../../components/screens/ErrorScreen';

function QuizListScreen() {
  const { quizList, fetchingQuizList, loadQuizList } = useQuizListCtx();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadQuizList();
      } catch (err) {
        setError(err);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={() => {
          setError(null);
          loadQuizList();
        }}
      />
    );
  }

  // ... rest of component
}
```

### 8. LocalStorage Management

```javascript
// src/funcs/LSFuncs.js

export const saveToLS = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLS = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromLS = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const clearLS = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// With TTL support
export const saveToLSWithTTL = (key, value, ttlMinutes) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + (ttlMinutes * 60 * 1000),
  };
  return saveToLS(key, item);
};

export const getFromLSWithTTL = (key) => {
  const item = getFromLS(key);

  if (!item) {
    return null;
  }

  const now = new Date();

  if (now.getTime() > item.expiry) {
    removeFromLS(key);
    return null;
  }

  return item.value;
};
```

### 9. URL Parameter Replacement

```javascript
// src/funcs/APIFuncs.js

export const replaceUrlParams = (url, params) => {
  let replacedUrl = url;

  Object.keys(params).forEach((key) => {
    const placeholder = `<${key}>`;
    replacedUrl = replacedUrl.replace(placeholder, encodeURIComponent(params[key]));
  });

  return replacedUrl;
};

export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

export const addTimestampParam = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}when=${Date.now()}`;
};
```

---

## Implementation Phases

### Phase 1: Foundation Setup (Week 1)

**Goal**: Set up project infrastructure and core utilities

#### Tasks

1. **Project Setup**
   - Install all dependencies from technology stack
   - Configure Vite with environment variables
   - Setup ESLint and Prettier
   - Create folder structure as per project layout

2. **Core Utilities**
   - Implement API method constants (`APIMethods.js`)
   - Create LocalStorage helper functions (`LSFuncs.js`)
   - Create API utility functions (`APIFuncs.js`)
   - Create date/time utility functions (`DateTimeFuncs.js`)
   - Create validation utility functions (`ValidationFuncs.js`)

3. **Network Layer**
   - Implement `useNetReq` hook for Axios wrapper
   - Implement `fetchWithAbort` utility in `CommonFetch.js`
   - Setup request/response interceptors
   - Implement token refresh mechanism

4. **Constants Setup**
   - Define LocalStorage constants (`LSConstants.js`)
   - Define route path constants (`RouteConstants.js`)
   - Define app constants (`AppConstants.js`)
   - Define quiz constants (`QuizConstants.js`)

5. **Theme Configuration**
   - Setup MUI theme with custom colors
   - Define CSS variables for theming
   - Setup global styles
   - Configure typography

**Deliverables**:
- Fully configured development environment
- Core utility functions implemented
- Network layer ready for API calls
- Theme and styling configured

---

### Phase 2: Authentication & Authorization (Week 2)

**Goal**: Implement complete authentication flow

#### Tasks

1. **Auth API Integration**
   - Create `AuthEndpoints.js` with all auth endpoints
   - Create `AuthServices.js` with service functions:
     - `loginUser`
     - `signupUser`
     - `verifyEmail`
     - `resendVerification`
     - `forgotPassword`
     - `resetPassword`
     - `changePassword`
     - `logoutUser`
     - `refreshToken`

2. **Auth Context**
   - Implement `AuthContextProvider.jsx`
   - State: user, isAuthenticated, isLoading, tokens
   - Methods: login, logout, updateUser
   - Token management with localStorage
   - Auto-load user on app mount
   - Token refresh on 401 error

3. **Auth Components**
   - `QuizCraftTextInput.jsx` - Text input component
   - `QuizCraftButton.jsx` - Button component
   - `LoadingScreen.jsx` - Full-page loader

4. **Auth Screens**
   - `LoginScreen.jsx` - Email/password login
   - `SignupScreen.jsx` - Registration form
   - `ForgotPasswordScreen.jsx` - Request reset email
   - `ResetPasswordScreen.jsx` - Reset with token
   - `VerifyEmailScreen.jsx` - Verify email with token
   - `ChangePasswordScreen.jsx` - Change password when logged in

5. **Route Guards**
   - `RequireAuth.jsx` - Protect authenticated routes
   - `RequireGuest.jsx` - Redirect if authenticated
   - `RequireVerified.jsx` - Require email verification

6. **Auth Routes**
   - Define routes in `AuthRoutes.jsx`:
     - `/login`
     - `/signup`
     - `/forgot-password`
     - `/reset-password`
     - `/verify-email`

**Deliverables**:
- Complete authentication system
- All auth screens functional
- Protected routes working
- Token management implemented

---

### Phase 3: Quiz Management (Week 3-4)

**Goal**: Implement quiz creation, editing, and management

#### Tasks

1. **Quiz API Integration**
   - Create `QuizEndpoints.js`
   - Create `QuestionEndpoints.js`
   - Create `AnswerEndpoints.js`
   - Create `QuizServices.js` with:
     - `fetchQuizList`
     - `fetchQuizById`
     - `fetchQuizFull`
     - `createQuiz`
     - `updateQuiz`
     - `deleteQuiz`
     - `publishQuiz`
     - `unpublishQuiz`
   - Create `QuestionServices.js` with CRUD operations
   - Create `AnswerServices.js` with CRUD operations

2. **Quiz Contexts**
   - `QuizListContextProvider.jsx`:
     - State: quizList, fetching, pagination
     - Methods: loadQuizList, deleteQuiz
   - `QuizDetailContextProvider.jsx`:
     - State: quiz, questions, fetching
     - Methods: loadQuiz, updateQuiz, publishQuiz
   - `QuizCreatorContextProvider.jsx`:
     - State: currentQuiz, questions, validationErrors
     - Methods: createQuiz, addQuestion, updateQuestion, deleteQuestion

3. **Quiz Components**
   - Cards:
     - `QuizCard.jsx` - Display quiz in grid
     - `QuestionCard.jsx` - Display question
   - Forms:
     - `QuizForm.jsx` - Quiz metadata form
     - `QuestionForm.jsx` - Question form with answers
     - `AnswerForm.jsx` - Individual answer input
   - Display:
     - `QuestionList.jsx` - List of questions
     - `DifficultyChip.jsx` - Difficulty badge
     - `CategoryChip.jsx` - Category badge
   - Inputs:
     - `TagInput.jsx` - Chips input for tags
     - `QuizCraftSelect.jsx` - Dropdown select
     - `QuizCraftAutocomplete.jsx` - Autocomplete input

4. **Quiz Screens**
   - `QuizListScreen.jsx`:
     - Display user's quizzes in grid
     - Filter by status (published/draft)
     - Search and sort
     - Pagination
   - `QuizCreateScreen.jsx`:
     - Multi-step wizard:
       1. Quiz metadata (title, description, category, etc.)
       2. Add questions
       3. Review and publish
   - `QuizEditScreen.jsx`:
     - Edit quiz metadata
     - Navigate to question management
   - `QuestionManageScreen.jsx`:
     - List all questions
     - Add/edit/delete questions
     - Reorder questions
     - Add/edit/delete answers
   - `QuizDetailScreen.jsx`:
     - View quiz details
     - Question count, stats
     - Actions: Edit, Delete, Publish, Share

5. **Quiz Routes**
   - Define routes in `QuizRoutes.jsx`:
     - `/quizzes` - List
     - `/quizzes/create` - Create wizard
     - `/quizzes/:id` - Detail
     - `/quizzes/:id/edit` - Edit
     - `/quizzes/:id/questions` - Manage questions

**Deliverables**:
- Complete quiz CRUD functionality
- Question and answer management
- Multi-step quiz creation wizard
- Quiz publishing workflow

---

### Phase 4: Quiz Taking & Attempts (Week 5)

**Goal**: Implement quiz-taking experience

#### Tasks

1. **Attempt API Integration**
   - Create `AttemptEndpoints.js`
   - Create `AttemptServices.js` with:
     - `startAttempt`
     - `fetchAttempt`
     - `submitAnswer`
     - `finishAttempt`
     - `fetchAttemptResults`
     - `fetchAttemptList`

2. **Attempt Contexts**
   - `AttemptContextProvider.jsx`:
     - State: attempt, questions, userAnswers, timeRemaining
     - Methods: startQuiz, submitAnswer, finishQuiz
     - Timer management
     - Auto-submit on time expiry
   - `AttemptListContextProvider.jsx`:
     - State: attemptList, fetching, filters
     - Methods: loadAttemptList, filterByQuiz, filterByStatus

3. **Quiz Taking Components**
   - `QuestionDisplay.jsx` - Display single question
   - `AnswerOption.jsx` - Selectable answer option
   - `QuizTimer.jsx` - Countdown timer
   - `QuizProgress.jsx` - Progress indicator
   - `NavigationButtons.jsx` - Previous/Next/Submit
   - `ScoreBadge.jsx` - Display score/percentage

4. **Attempt Screens**
   - `QuizStartScreen.jsx`:
     - Quiz overview
     - Instructions
     - Time limit display
     - Start button
   - `QuizTakeScreen.jsx`:
     - Display one question at a time
     - Timer (if applicable)
     - Answer selection
     - Navigation between questions
     - Progress indicator
     - Save progress on answer change
     - Finish button
   - `QuizResultScreen.jsx`:
     - Score and percentage
     - Pass/fail status
     - Question-by-question review
     - Correct answers highlighted
     - Explanations displayed
     - Retry button
   - `AttemptListScreen.jsx`:
     - List of user's attempts
     - Filter by quiz, status
     - View results button

5. **Attempt Routes**
   - Define routes in `AttemptRoutes.jsx`:
     - `/quiz/:id/start` - Start screen
     - `/quiz/:id/take/:attemptId` - Take quiz
     - `/attempts/:id/results` - View results
     - `/attempts` - List attempts

6. **Timer Hook**
   - Create `useTimer.js` hook:
     - Countdown timer
     - Auto-submit on expiry
     - Pause/resume (if needed)

**Deliverables**:
- Complete quiz-taking experience
- Timer functionality
- Progressive answer submission
- Results display with review
- Attempt history

---

### Phase 5: Search & Discovery (Week 6)

**Goal**: Implement public quiz browsing and search

#### Tasks

1. **Search API Integration**
   - Create `SearchEndpoints.js`
   - Create `SearchServices.js` with:
     - `searchQuizzes`
     - `fetchCategories`
     - `fetchPopularTags`
     - `fetchQuizByShareCode`

2. **Search Context**
   - `SearchContextProvider.jsx`:
     - State: searchResults, filters, facets, loading
     - Filters: query, category, difficulty, tags
     - Methods: searchQuizzes, applyFilters, clearFilters

3. **Search Components**
   - `SearchBar.jsx` - Search input with debounce
   - `FilterPanel.jsx` - Filter options
   - `FacetList.jsx` - Category/difficulty facets
   - `SortDropdown.jsx` - Sort options
   - `PublicQuizCard.jsx` - Quiz card for discovery

4. **Search Screens**
   - `DiscoverScreen.jsx`:
     - Browse public quizzes
     - Category grid
     - Featured/popular quizzes
     - Recently added quizzes
   - `SearchScreen.jsx`:
     - Search bar
     - Filter panel (category, difficulty, tags)
     - Sort options (newest, popular, most attempted)
     - Search results grid
     - Pagination
     - Faceted navigation
   - `QuizDetailPublicScreen.jsx`:
     - Public quiz details (no correct answers shown)
     - Creator info
     - Stats (attempts, average score)
     - Take quiz button

5. **Search Routes**
   - Define routes in `SearchRoutes.jsx`:
     - `/discover` - Browse page
     - `/search` - Search results
     - `/quiz/:id/preview` - Public quiz detail
     - `/share/:code` - Shared quiz link

**Deliverables**:
- Public quiz browsing
- Search with filters
- Faceted navigation
- Share functionality

---

### Phase 6: User Profile & Statistics (Week 7)

**Goal**: Implement user profile and statistics

#### Tasks

1. **User API Integration**
   - Create `UserEndpoints.js`
   - Create `StatisticsEndpoints.js`
   - Create `UserServices.js` with:
     - `fetchUserProfile`
     - `updateUserProfile`
     - `deleteAccount`
   - Create `StatisticsServices.js` with:
     - `fetchUserStatistics`
     - `fetchQuizStatistics`

2. **User Context**
   - `UserContextProvider.jsx`:
     - State: profile, statistics, loading
     - Methods: loadProfile, updateProfile

3. **Profile Components**
   - `ProfileHeader.jsx` - User info header
   - `StatCard.jsx` - Display single stat
   - `StatGrid.jsx` - Grid of stats
   - `AchievementBadge.jsx` - Badges/achievements
   - `ActivityChart.jsx` - Activity graph (optional)

4. **Profile Screens**
   - `ProfileScreen.jsx`:
     - User information
     - Statistics overview
     - Recent activity
     - Achievements
   - `ProfileEditScreen.jsx`:
     - Edit name, phone
     - Change password link
     - Delete account option
   - `StatisticsScreen.jsx`:
     - Detailed statistics:
       - Quizzes created
       - Quizzes taken
       - Average score
       - Pass rate
       - Streak info
     - Charts and graphs
     - Activity timeline

5. **Quiz Stats Screen**
   - `QuizStatsScreen.jsx` (for quiz creators):
     - Total attempts
     - Unique users
     - Average score
     - Pass rate
     - Question-level statistics
     - Performance over time

6. **User Routes**
   - Define routes in `UserRoutes.jsx`:
     - `/profile` - View profile
     - `/profile/edit` - Edit profile
     - `/profile/statistics` - User stats
     - `/quizzes/:id/stats` - Quiz stats (creator only)

**Deliverables**:
- User profile management
- Comprehensive statistics
- Quiz creator analytics

---

### Phase 7: Admin Panel (Week 8) - Optional

**Goal**: Implement admin dashboard (if admin role exists)

#### Tasks

1. **Admin API Integration**
   - Create `AdminEndpoints.js`
   - Create `AdminServices.js` with:
     - User management (list, disable, enable, delete, change role)
     - Quiz management (list, delete)
     - Platform statistics
     - Activity logs

2. **Admin Context**
   - `AdminContextProvider.jsx`:
     - State: users, quizzes, stats, logs
     - Methods: loadUsers, loadQuizzes, loadStats, loadLogs

3. **Admin Components**
   - `UserTable.jsx` - Data grid for users
   - `QuizTable.jsx` - Data grid for quizzes
   - `StatDashboard.jsx` - Platform stats dashboard
   - `ActivityLog.jsx` - Activity log table
   - `UserActionsMenu.jsx` - Dropdown menu for user actions

4. **Admin Screens**
   - `AdminDashboard.jsx`:
     - Platform overview
     - Key metrics
     - Quick actions
   - `UserManagementScreen.jsx`:
     - List all users
     - Search and filter
     - Actions: Disable, Enable, Change role, Delete
   - `QuizManagementScreen.jsx`:
     - List all quizzes
     - Filter by creator, status
     - Actions: View, Delete
   - `PlatformStatsScreen.jsx`:
     - Total users, active users
     - Total quizzes, published quizzes
     - Total attempts, completion rate
     - Growth charts
   - `ActivityLogsScreen.jsx`:
     - Audit trail
     - Filter by action, user, date

5. **Admin Guard**
   - `RequireAdmin.jsx` - Check admin role

6. **Admin Routes**
   - Define routes in `AdminRoutes.jsx`:
     - `/admin` - Dashboard
     - `/admin/users` - User management
     - `/admin/quizzes` - Quiz management
     - `/admin/stats` - Platform stats
     - `/admin/logs` - Activity logs

**Deliverables**:
- Complete admin panel
- User and quiz management
- Platform analytics
- Activity logging

---

### Phase 8: Polish & Enhancement (Week 9)

**Goal**: Polish UI/UX and add enhancements

#### Tasks

1. **Animations & Transitions**
   - Add Framer Motion page transitions
   - Add loading animations with Lottie
   - Add micro-interactions (button hover, card hover)
   - Add success/error animations

2. **Error Handling**
   - Create `ErrorScreen.jsx` with retry
   - Create `EmptyState.jsx` for no data
   - Implement error boundaries
   - Add toast notifications for all actions

3. **Responsive Design**
   - Mobile optimization for all screens
   - Tablet breakpoints
   - Touch-friendly buttons and inputs

4. **Accessibility**
   - Add ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support

5. **Performance Optimization**
   - Code splitting with React.lazy
   - Image optimization
   - Lazy loading for lists
   - Request cancellation on unmount

6. **Additional Features**
   - Dark mode toggle (optional)
   - Print quiz functionality
   - Export results as PDF
   - Social sharing

**Deliverables**:
- Polished, professional UI
- Smooth animations
- Responsive on all devices
- Accessible
- Optimized performance

---

### Phase 9: Testing & Bug Fixes (Week 10)

**Goal**: Test all features and fix bugs

#### Tasks

1. **Manual Testing**
   - Test all user flows
   - Test on different browsers
   - Test on mobile devices
   - Test error scenarios

2. **Bug Fixes**
   - Fix identified bugs
   - Handle edge cases
   - Improve error messages

3. **Code Quality**
   - Refactor duplicate code
   - Add missing PropTypes
   - Remove console.logs
   - Fix linting errors

4. **Documentation**
   - Update README with setup instructions
   - Document components
   - Document API integration
   - Add inline comments

**Deliverables**:
- Bug-free application
- Clean, maintainable code
- Complete documentation

---

### Phase 10: Deployment (Week 11)

**Goal**: Deploy to production

#### Tasks

1. **Build Optimization**
   - Optimize bundle size
   - Enable compression
   - Configure CDN for assets

2. **Environment Configuration**
   - Setup production environment variables
   - Configure API endpoints
   - Setup analytics (Google Analytics)

3. **Deployment**
   - Deploy to hosting (Vercel/Netlify/AWS)
   - Setup CI/CD pipeline
   - Configure domain and SSL

4. **Monitoring**
   - Setup error tracking (Sentry)
   - Setup performance monitoring
   - Setup analytics dashboard

**Deliverables**:
- Production-ready application
- Deployed and accessible
- Monitoring in place

---

## Feature-by-Feature Implementation Guide

### Authentication Features

#### 1. Signup Flow
```
User fills signup form (email, name, password)
    ↓
POST /auth/signup
    ↓
Success: Show "Verification email sent" message
    ↓
User clicks link in email
    ↓
POST /auth/verify-email with token
    ↓
Success: Redirect to login
```

#### 2. Login Flow
```
User fills login form (email, password)
    ↓
POST /auth/login
    ↓
Success: Save tokens and user data to localStorage
    ↓
Update AuthContext state
    ↓
Redirect to dashboard
```

#### 3. Password Reset Flow
```
User enters email on forgot password page
    ↓
POST /auth/forgot-password
    ↓
User clicks link in email
    ↓
User enters new password
    ↓
POST /auth/reset-password with token
    ↓
Success: Redirect to login
```

---

### Quiz Creation Flow

#### Step 1: Quiz Metadata
```jsx
<QuizForm>
  <TextInput label="Title" />
  <TextInput label="Description" multiline />
  <Autocomplete label="Category" options={categories} />
  <Select label="Difficulty" options={['easy', 'medium', 'hard']} />
  <TextInput label="Time Limit (minutes)" type="number" />
  <TextInput label="Passing Score (%)" type="number" />
  <Switch label="Public Quiz" />
  <TagInput label="Tags" />
  <Button onClick={handleSaveMetadata}>Next: Add Questions</Button>
</QuizForm>
```

#### Step 2: Add Questions
```jsx
<QuestionManageScreen>
  <QuestionList questions={questions} onEdit={handleEdit} onDelete={handleDelete} />
  <Button onClick={handleAddQuestion}>Add Question</Button>

  <Dialog open={questionDialogOpen}>
    <QuestionForm>
      <TextInput label="Question Text" multiline />
      <Select label="Question Type" options={['multiple_choice', 'true_false']} />
      <TextInput label="Points" type="number" />
      <TextInput label="Explanation" multiline />

      <Typography>Answers</Typography>
      {answers.map((answer, index) => (
        <AnswerForm key={index}>
          <TextInput label="Answer Text" />
          <Checkbox label="Correct" />
        </AnswerForm>
      ))}
      <Button onClick={handleAddAnswer}>Add Answer</Button>

      <Button onClick={handleSaveQuestion}>Save Question</Button>
    </QuestionForm>
  </Dialog>
</QuestionManageScreen>
```

#### Step 3: Publish
```jsx
<QuizDetailScreen>
  <Typography variant="h4">{quiz.title}</Typography>
  <Typography>{quiz.description}</Typography>
  <Chip label={quiz.difficulty} />
  <Typography>Questions: {questionCount}</Typography>

  {!quiz.is_published && (
    <Button onClick={handlePublish}>Publish Quiz</Button>
  )}

  {quiz.is_published && (
    <Button onClick={handleUnpublish}>Unpublish</Button>
  )}
</QuizDetailScreen>
```

---

### Quiz Taking Flow

#### Step 1: Start Quiz
```jsx
<QuizStartScreen>
  <Typography variant="h3">{quiz.title}</Typography>
  <Typography>{quiz.description}</Typography>

  <InfoDataGrid>
    <InfoDataItem label="Questions" value={questionCount} />
    <InfoDataItem label="Time Limit" value={`${quiz.time_limit_minutes} minutes`} />
    <InfoDataItem label="Passing Score" value={`${quiz.passing_score}%`} />
    <InfoDataItem label="Difficulty" value={quiz.difficulty} />
  </InfoDataGrid>

  <Button onClick={handleStartAttempt}>Start Quiz</Button>
</QuizStartScreen>
```

#### Step 2: Take Quiz
```jsx
<QuizTakeScreen>
  <QuizTimer timeRemaining={timeRemaining} />
  <QuizProgress current={currentQuestion} total={totalQuestions} />

  <QuestionDisplay question={questions[currentQuestion]}>
    {question.answers.map((answer) => (
      <AnswerOption
        key={answer.id}
        answer={answer}
        selected={userAnswers[question.id] === answer.id}
        onClick={() => handleAnswerSelect(question.id, answer.id)}
      />
    ))}
  </QuestionDisplay>

  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
    <Button disabled={currentQuestion === 0} onClick={handlePrevious}>
      Previous
    </Button>

    {currentQuestion < totalQuestions - 1 ? (
      <Button onClick={handleNext}>Next</Button>
    ) : (
      <Button onClick={handleFinish}>Finish Quiz</Button>
    )}
  </Box>
</QuizTakeScreen>
```

#### Step 3: View Results
```jsx
<QuizResultScreen>
  <Typography variant="h3">Quiz Results</Typography>

  <Box sx={{ textAlign: 'center', my: 4 }}>
    <ScoreBadge score={attempt.score} maxScore={attempt.max_score} />
    <Typography variant="h4">{attempt.percentage}%</Typography>
    <Chip
      label={attempt.passed ? 'PASSED' : 'FAILED'}
      color={attempt.passed ? 'success' : 'error'}
    />
  </Box>

  <Typography variant="h5">Question Review</Typography>
  {questions.map((question, index) => (
    <Card key={question.id}>
      <Typography>Q{index + 1}: {question.question_text}</Typography>

      {question.answers.map((answer) => (
        <AnswerOption
          key={answer.id}
          answer={answer}
          selected={userAnswers.find(ua => ua.question_id === question.id)?.answer_id === answer.id}
          correct={answer.is_correct}
          showCorrect={true}
        />
      ))}

      {question.explanation && (
        <Typography variant="body2" color="text.secondary">
          {question.explanation}
        </Typography>
      )}
    </Card>
  ))}

  <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
  <Button onClick={handleRetake}>Retake Quiz</Button>
</QuizResultScreen>
```

---

## Development Guidelines

### Code Style

1. **Use ESLint and Prettier** for consistent code formatting
2. **Always use PropTypes** for component prop validation
3. **Use functional components** with hooks (no class components)
4. **Use arrow functions** for component definitions
5. **Destructure props** at the beginning of components
6. **Use meaningful variable names** (no single-letter variables except in loops)

### Component Guidelines

1. **Keep components small** - Single responsibility principle
2. **Extract reusable logic** into custom hooks
3. **Use composition** over inheritance
4. **Avoid prop drilling** - Use Context for deeply nested props
5. **Handle loading and error states** in every component

### State Management

1. **Use Context** for global state (user, auth, quiz list)
2. **Use useState** for local component state
3. **Use useRef** for AbortController and DOM references
4. **Avoid unnecessary re-renders** - Use useMemo and useCallback when needed

### API Integration

1. **Always use AbortController** for request cancellation
2. **Handle errors gracefully** with toast notifications
3. **Show loading states** during API calls
4. **Implement optimistic updates** where appropriate
5. **Cache data** when possible with localStorage

### Performance

1. **Code split routes** using React.lazy
2. **Optimize images** and use appropriate formats
3. **Debounce search inputs** with custom hook
4. **Lazy load components** that are below the fold
5. **Minimize bundle size** - Audit with Vite bundle analyzer

### Security

1. **Never expose secrets** in frontend code
2. **Validate all user inputs** before submission
3. **Sanitize data** before rendering (XSS prevention)
4. **Use HTTPS** in production
5. **Implement CSRF protection** if needed

### Testing (Future)

1. **Write unit tests** for utility functions
2. **Write integration tests** for API services
3. **Write E2E tests** for critical user flows
4. **Test accessibility** with automated tools

---

## Testing Strategy

### Manual Testing Checklist

#### Authentication
- [ ] Signup with valid data
- [ ] Signup with existing email (should fail)
- [ ] Email verification flow
- [ ] Resend verification email
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Login with unverified email
- [ ] Forgot password flow
- [ ] Reset password with token
- [ ] Change password when logged in
- [ ] Logout
- [ ] Token refresh on 401
- [ ] Protected route redirect

#### Quiz Management
- [ ] Create quiz with metadata
- [ ] Add questions to quiz
- [ ] Add answers to questions
- [ ] Edit quiz metadata
- [ ] Edit questions
- [ ] Delete questions
- [ ] Reorder questions
- [ ] Publish quiz
- [ ] Unpublish quiz
- [ ] Delete quiz
- [ ] View quiz statistics

#### Quiz Taking
- [ ] Start quiz attempt
- [ ] Answer questions
- [ ] Navigate between questions
- [ ] Timer countdown (if applicable)
- [ ] Auto-submit on timer expiry
- [ ] Manual submit
- [ ] View results
- [ ] View correct answers and explanations
- [ ] Retake quiz

#### Search & Discovery
- [ ] Browse public quizzes
- [ ] Search quizzes by title
- [ ] Filter by category
- [ ] Filter by difficulty
- [ ] Filter by tags
- [ ] Sort by newest
- [ ] Sort by popular
- [ ] View public quiz details
- [ ] Access quiz via share link

#### User Profile
- [ ] View profile
- [ ] Edit profile
- [ ] View user statistics
- [ ] Change password
- [ ] Delete account

#### Admin (if applicable)
- [ ] View admin dashboard
- [ ] List all users
- [ ] Disable/enable user
- [ ] Change user role
- [ ] Delete user
- [ ] List all quizzes
- [ ] Delete quiz
- [ ] View platform statistics
- [ ] View activity logs

---

## Deployment Strategy

### Environment Variables

#### Development (`.env.development`)
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=QuizCraft
VITE_ENABLE_ANALYTICS=false
```

#### Production (`.env.production`)
```
VITE_API_BASE_URL=https://api.quizcraft.com/api/v1
VITE_APP_NAME=QuizCraft
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Build Process

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Hosting Options

1. **Vercel** (Recommended)
   - Automatic deployments from Git
   - Built-in CDN
   - Serverless functions support
   - Free SSL
   - Custom domain support

2. **Netlify**
   - Similar features to Vercel
   - Drag-and-drop deployment
   - Form handling

3. **AWS S3 + CloudFront**
   - More control over infrastructure
   - Pay-as-you-go pricing
   - High availability

4. **Firebase Hosting**
   - Google Cloud integration
   - Fast CDN
   - Easy setup

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_GA_TRACKING_ID: ${{ secrets.GA_TRACKING_ID }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Conclusion

This implementation approach provides a comprehensive roadmap for building the QuizCraft frontend application following the proven patterns from the Phoenix application. The phased approach ensures systematic development, allowing for testing and iteration at each stage.

### Key Success Factors

1. **Strict Pattern Adherence** - Follow Phoenix patterns exactly as documented
2. **Incremental Development** - Build and test one phase at a time
3. **Quality Over Speed** - Prioritize code quality and maintainability
4. **User-Centric Design** - Focus on user experience and error handling
5. **Documentation** - Document code, patterns, and decisions
6. **Testing** - Test thoroughly at each phase

### Next Steps

1. Review this document with the team
2. Setup development environment (Phase 1)
3. Begin implementation starting with Phase 1
4. Conduct code reviews after each phase
5. Iterate and refine based on feedback

---

**Document Prepared By**: Claude Code
**For**: QuizCraft Frontend Team
**Based On**: Phoenix App Architecture Analysis
**Backend API**: QuizCraft Backend API v1.0

---

*This document is a living document and should be updated as the project evolves.*
