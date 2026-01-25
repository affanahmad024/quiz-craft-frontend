// Image Upload Field Component
// Following Phoenix pattern

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  Typography,
  alpha,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

/**
 * ImageUploadField Component
 * Handles image file selection with preview (no immediate upload)
 * @param {function} onChange - Callback when file is selected (receives file object)
 * @param {File|string} value - Current file object or file ID
 * @param {string} error - Error message (optional)
 * @param {string} helperText - Helper text (optional)
 */
function ImageUploadField({ onChange, value, error, helperText }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Create preview when value changes
  useEffect(() => {
    if (value instanceof File) {
      const preview = URL.createObjectURL(value);
      setPreviewUrl(preview);
      setFileName(value.name);

      // Cleanup
      return () => URL.revokeObjectURL(preview);
    } else if (typeof value === 'string' && value) {
      // If value is a URL string (for editing existing questions)
      setPreviewUrl(value);
      setFileName('Existing image');
    } else {
      setPreviewUrl(null);
      setFileName('');
    }
  }, [value]);

  /**
   * Handle file selection
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Pass file object to parent
    onChange(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle image removal
   */
  const handleRemove = () => {
    if (previewUrl && value instanceof File) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName('');
    onChange(null);
  };

  /**
   * Trigger file input click
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {!previewUrl && !value ? (
        // Upload button (no image selected)
        <Box
          sx={{
            border: '2px dashed',
            borderColor: error ? '#f5576c' : '#E8E8E8',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: alpha('#F8F9FA', 0.5),
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#667eea',
              backgroundColor: alpha('#667eea', 0.05),
            },
          }}
          onClick={handleButtonClick}
        >
          <CloudUploadIcon
            sx={{ fontSize: 48, color: '#667eea', mb: 1 }}
          />
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Click to upload image
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, GIF up to 5MB
          </Typography>
        </Box>
      ) : (
        // Preview with remove button
        <Box
          sx={{
            border: '2px solid',
            borderColor: error ? '#f5576c' : '#E8E8E8',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#F8F9FA',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {previewUrl ? (
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E8E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  backgroundColor: alpha('#667eea', 0.1),
                  border: '1px solid #E8E8E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageIcon sx={{ fontSize: 40, color: '#667eea' }} />
              </Box>
            )}

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                {fileName || 'Image selected'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {value instanceof File ? `${(value.size / 1024).toFixed(1)} KB` : 'Ready to upload'}
              </Typography>
            </Box>

            <IconButton
              onClick={handleRemove}
              sx={{
                color: '#f5576c',
                '&:hover': {
                  backgroundColor: alpha('#f5576c', 0.1),
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Button
            onClick={handleButtonClick}
            startIcon={<CloudUploadIcon />}
            sx={{
              mt: 2,
              color: '#667eea',
              borderColor: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                backgroundColor: alpha('#667eea', 0.05),
              },
            }}
            variant="outlined"
            size="small"
            fullWidth
          >
            Change Image
          </Button>
        </Box>
      )}

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

ImageUploadField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.string,
  ]),
  error: PropTypes.string,
  helperText: PropTypes.string,
};

ImageUploadField.defaultProps = {
  value: null,
  error: '',
  helperText: 'Optional: Add an image to your question',
};

export default ImageUploadField;
