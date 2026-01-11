// Loading Screen Component
// Following Phoenix pattern

import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: 'easeOut',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </motion.div>
    </Box>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

export default LoadingScreen;
