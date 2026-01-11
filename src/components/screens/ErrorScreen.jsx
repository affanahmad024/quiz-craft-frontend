// Error Screen Component
// Following Phoenix pattern

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/RouteConstants';
import PropTypes from 'prop-types';

function ErrorScreen({ error, onRetry, showHomeButton = true }) {
  const navigate = useNavigate();
  const errorMessage =
    error?.message || error || 'Something went wrong. Please try again.';

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />
        </motion.div>

        <Typography variant="h5" gutterBottom>
          Oops! Something went wrong
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {errorMessage}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              }}
            >
              Try Again
            </Button>
          )}

          {showHomeButton && (
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                borderColor: '#6C5CE7',
                color: '#6C5CE7',
              }}
            >
              Go Home
            </Button>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}

ErrorScreen.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRetry: PropTypes.func,
  showHomeButton: PropTypes.bool,
};

export default ErrorScreen;
