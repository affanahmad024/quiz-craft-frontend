// Tag Input Component
// Reusable tag input with chips
// Following Phoenix pattern

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

/**
 * TagInput Component
 * Input field for adding/removing tags
 */
function TagInput({ value = [], onChange, placeholder = 'Type a tag and press Enter', error, helperText }) {
  const [tagInput, setTagInput] = useState('');

  // Handle tag input change
  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  // Handle tag input key press
  const handleTagKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  // Add a new tag
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: error ? '#f5576c' : '#2D3436',
        }}
      >
        Tags (Optional)
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 1.5,
          backgroundColor: '#F8F9FA',
          borderRadius: 2,
          border: '2px solid',
          borderColor: error ? '#f5576c' : '#E8E8E8',
          minHeight: 56,
          alignItems: 'center',
          transition: 'all 0.2s',
          '&:focus-within': {
            borderColor: error ? '#f5576c' : '#667eea',
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        {value.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => removeTag(tag)}
            size="small"
            sx={{
              backgroundColor: '#667eea',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-deleteIcon': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: 'white',
                },
              },
            }}
          />
        ))}

        <Box
          sx={{
            flex: 1,
            minWidth: 120,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <input
            type="text"
            placeholder={value.length === 0 ? placeholder : ''}
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyPress}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              flex: 1,
              minWidth: 80,
              padding: '4px 0',
            }}
          />
          {tagInput.trim() && (
            <IconButton
              size="small"
              onClick={addTag}
              sx={{
                backgroundColor: '#667eea',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': {
                  backgroundColor: '#5568d3',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {(helperText || error) && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.75,
            color: error ? '#f5576c' : 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
}

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
};

TagInput.defaultProps = {
  value: [],
  placeholder: 'Type a tag and press Enter',
  error: '',
  helperText: 'Add tags to help organize and discover your content',
};

export default TagInput;
