// QuizCraft Button Component
// Following Phoenix pattern with PropTypes validation

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
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
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
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ]),
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
