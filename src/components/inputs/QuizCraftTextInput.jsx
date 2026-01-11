// QuizCraft Text Input Component
// Following Phoenix pattern with PropTypes validation

import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

function QuizCraftTextInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  multiline = false,
  rows = 4,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  sx = {},
  ...otherProps
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      sx={sx}
      {...otherProps}
    />
  );
}

QuizCraftTextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  sx: PropTypes.object,
};

export default QuizCraftTextInput;
