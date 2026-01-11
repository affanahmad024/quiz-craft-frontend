// Theme Mode Context
// Manages dark/light mode preference
// Following Phoenix pattern

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { getLocalStorage, setLocalStorage } from '../../utils/LocalStorageUtils';

const ThemeModeContext = createContext();

/**
 * Theme Mode Context Provider
 * Provides dark/light mode switching functionality
 */
function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return getLocalStorage('themeMode') || 'light';
  });

  useEffect(() => {
    setLocalStorage('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6C5CE7',
            light: '#A29BFE',
            dark: '#5F4FDB',
          },
          secondary: {
            main: '#FD79A8',
            light: '#FDCB6E',
            dark: '#E84393',
          },
          success: {
            main: '#00B894',
            light: '#55EFC4',
            dark: '#00A383',
          },
          error: {
            main: '#FF6B6B',
            light: '#FF8787',
            dark: '#EE5A52',
          },
          warning: {
            main: '#FDCB6E',
            light: '#FDE992',
            dark: '#E4B252',
          },
          info: {
            main: '#74B9FF',
            light: '#A8D5FF',
            dark: '#5FA3E6',
          },
          background: {
            default: mode === 'light' ? '#F8F9FA' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          text: {
            primary: mode === 'light' ? '#2D3436' : '#FFFFFF',
            secondary: mode === 'light' ? '#636E72' : '#B2B2B2',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 600,
                padding: '10px 24px',
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 2px 8px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.4)',
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleMode,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

ThemeModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useThemeMode Hook
 * Access theme mode context
 */
export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
}

export default ThemeModeProvider;
