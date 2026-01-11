// Loading Screen Component
// Following Phoenix pattern

import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

export default LoadingScreen;
