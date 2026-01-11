// Theme Toggle Component
// Button to toggle between light and dark mode
// Following Phoenix pattern

import { IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../../contexts/theme/ThemeModeContext';

const MotionIconButton = motion(IconButton);

/**
 * Theme Toggle Component
 * Animated button to switch between light and dark modes
 */
function ThemeToggle() {
  const { mode, toggleMode, isDarkMode } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <MotionIconButton
        onClick={toggleMode}
        color="inherit"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </MotionIconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
