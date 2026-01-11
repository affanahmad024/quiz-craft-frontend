// Empty State Component
// Following Phoenix pattern

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import QuizIcon from '@mui/icons-material/Quiz';
import PropTypes from 'prop-types';

function EmptyState({
  icon: Icon = InboxIcon,
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  action = null,
  actionLabel,
  onAction,
  variant = 'default', // 'default', 'search', 'quiz'
}) {
  // Select icon based on variant if default icon
  const getIcon = () => {
    if (Icon !== InboxIcon) return Icon;

    switch (variant) {
      case 'search':
        return SearchOffIcon;
      case 'quiz':
        return QuizIcon;
      default:
        return InboxIcon;
    }
  };

  const IconComponent = getIcon();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        textAlign: 'center',
        px: 3,
        py: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(108, 92, 231, 0.1)',
            borderRadius: '50%',
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <IconComponent
            sx={{
              fontSize: 60,
              color: '#6C5CE7',
            }}
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          {description}
        </Typography>

        {action}

        {!action && actionLabel && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
            sx={{
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              px: 4,
              py: 1.5,
            }}
          >
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </Box>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'search', 'quiz']),
};

export default EmptyState;
