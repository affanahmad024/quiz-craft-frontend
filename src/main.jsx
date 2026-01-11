// Main Entry Point
// Following Phoenix pattern

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import theme from './styles/theme.js';
import AuthContextProvider from './contexts/auth/AuthContextProvider';
import QuizContextProvider from './contexts/quiz/QuizContextProvider';
import AttemptContextProvider from './contexts/attempt/AttemptContextProvider';
import DiscoveryContextProvider from './contexts/discovery/DiscoveryContextProvider';
import ProfileContextProvider from './contexts/profile/ProfileContextProvider';
import AdminContextProvider from './contexts/admin/AdminContextProvider';
import './styles/variables.css';
import './styles/global.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <QuizContextProvider>
            <AttemptContextProvider>
              <DiscoveryContextProvider>
                <ProfileContextProvider>
                  <AdminContextProvider>
                    <CssBaseline />
                    <App />
                    <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#2D3436',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#00B894',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF6B6B',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
                  </AdminContextProvider>
                </ProfileContextProvider>
              </DiscoveryContextProvider>
            </AttemptContextProvider>
          </QuizContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
