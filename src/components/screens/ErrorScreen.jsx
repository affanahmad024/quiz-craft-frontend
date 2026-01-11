// Error Screen Component
// Following Phoenix pattern

import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';

function ErrorScreen({ error, onRetry }) {
  const errorMessage =
    error?.message || error || 'Something went wrong. Please try again.';

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
      <ErrorOutlineIcon
        sx={{
          fontSize: 80,
          color: 'error.main',
          mb: 2,
        }}
      />

      <Typography variant="h5" gutterBottom>
        Oops! Something went wrong
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {errorMessage}
      </Typography>

      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
}

ErrorScreen.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRetry: PropTypes.func,
};

export default ErrorScreen;
