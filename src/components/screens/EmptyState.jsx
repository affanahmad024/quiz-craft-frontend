// Empty State Component
// Following Phoenix pattern

import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import PropTypes from 'prop-types';

function EmptyState({
  icon: Icon = InboxIcon,
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  action = null
}) {
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
      <Icon
        sx={{
          fontSize: 80,
          color: 'text.disabled',
          mb: 2,
        }}
      />

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      {action}
    </Box>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
};

export default EmptyState;
