// Image Upload Field Component
// Following Phoenix pattern

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  alpha,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { getFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';
import { toast } from 'react-hot-toast';

/**
 * ImageUploadField Component
 * Handles image file uploads with preview
 * @param {function} onChange - Callback when file is uploaded (receives file_id)
 * @param {string} value - Current file ID (optional)
 * @param {string} error - Error message (optional)
 * @param {string} helperText - Helper text (optional)
 */
function ImageUploadField({ onChange, value, error, helperText }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Get API base URL
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

  /**
   * Handle file selection and upload
   */
  const handleFileChange = async (event) => {
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

    setUploading(true);
    setFileName(file.name);

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token
      const token = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);

      // Upload file
      const response = await axios.post(
        `${baseURL}/files/upload`,
        formData,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'X-Application-Name': 'quizcraft',
          },
          withCredentials: true,
        }
      );

      if (response.data?.data?.id) {
        const fileId = response.data.data.id;
        onChange(fileId);
        toast.success('Image uploaded successfully');
      } else if (response.data?.id) {
        // Handle direct ID in response
        const fileId = response.data.id;
        onChange(fileId);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.error?.message || 'Failed to upload image');
      // Clear preview on error
      setPreviewUrl(null);
      setFileName('');
      URL.revokeObjectURL(preview);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Handle image removal
   */
  const handleRemove = () => {
    if (previewUrl) {
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
        // Upload button (no image uploaded)
        <Box
          sx={{
            border: '2px dashed',
            borderColor: error ? '#f5576c' : '#E8E8E8',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: alpha('#F8F9FA', 0.5),
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: uploading ? undefined : '#667eea',
              backgroundColor: uploading ? undefined : alpha('#667eea', 0.05),
            },
          }}
          onClick={uploading ? undefined : handleButtonClick}
        >
          {uploading ? (
            <Box>
              <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Uploading...
              </Typography>
            </Box>
          ) : (
            <Box>
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
          )}
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
                {fileName || 'Image uploaded'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {previewUrl ? 'Ready to use' : 'File ID: ' + value}
              </Typography>
            </Box>

            <IconButton
              onClick={handleRemove}
              disabled={uploading}
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
            disabled={uploading}
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
  value: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
};

ImageUploadField.defaultProps = {
  value: null,
  error: '',
  helperText: 'Optional: Add an image to your question',
};

export default ImageUploadField;
