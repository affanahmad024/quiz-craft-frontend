// Question Image Component
// Display question images with zoom capability
// Following Phoenix pattern

import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  BrokenImage as BrokenImageIcon,
} from '@mui/icons-material';
import { getFromLS } from '../../funcs/LSFuncs';
import { LS_CONSTS } from '../../constants/LSConstants';

/**
 * QuestionImage Component
 * Displays question image with loading state, error handling, and zoom capability
 */
function QuestionImage({ imageUrl, alt = 'Question image', sx = {} }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Get API base URL and construct full image URL
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  const fullImageUrl = useMemo(() => {
    if (!imageUrl) return null;

    // If imageUrl already starts with http/https, use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If imageUrl starts with /api/v1, replace with full base URL
    if (imageUrl.startsWith('/api/v1')) {
      return imageUrl.replace('/api/v1', baseURL);
    }

    // Otherwise, append to base URL
    return `${baseURL}/${imageUrl}`;
  }, [imageUrl, baseURL]);

  // Get auth token for authenticated image requests
  const authToken = getFromLS(LS_CONSTS.LS_ACCESS_TOKEN);

  // State for blob URL
  const [blobUrl, setBlobUrl] = useState(null);

  // Fetch image with authentication
  useEffect(() => {
    if (!fullImageUrl) return;

    let currentBlobUrl = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(fullImageUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Application-Name': 'quizcraft',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load image');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        currentBlobUrl = url;
        setBlobUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup blob URL on unmount
    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [fullImageUrl, authToken]);

  // Open zoom modal
  const handleZoomOpen = () => {
    if (!error && !loading) {
      setZoomOpen(true);
    }
  };

  // Close zoom modal
  const handleZoomClose = () => {
    setZoomOpen(false);
  };

  if (!fullImageUrl) {
    return null;
  }

  return (
    <>
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#F8F9FA',
          border: '1px solid #E8E8E8',
          ...sx,
        }}
      >
        {/* Loading Spinner */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }}
          >
            <CircularProgress size={40} sx={{ color: '#667eea' }} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
              color: '#636E72',
            }}
          >
            <BrokenImageIcon sx={{ fontSize: 60, mb: 1, color: '#B2BEC3' }} />
            <Box sx={{ fontSize: '0.875rem' }}>Failed to load image</Box>
          </Box>
        )}

        {/* Image */}
        {!error && blobUrl && (
          <Box
            sx={{
              position: 'relative',
              cursor: 'zoom-in',
              '&:hover .zoom-icon': {
                opacity: 1,
              },
            }}
            onClick={handleZoomOpen}
          >
            <img
              src={blobUrl}
              alt={alt}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />

            {/* Zoom Icon Overlay */}
            <Box
              className="zoom-icon"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                opacity: 0,
                transition: 'opacity 0.2s',
                backgroundColor: alpha('#000000', 0.6),
                borderRadius: '50%',
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ZoomInIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Zoom Modal */}
      <Dialog
        open={zoomOpen}
        onClose={handleZoomClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxWidth: '95vw',
            maxHeight: '95vh',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleZoomClose}
            sx={{
              position: 'absolute',
              top: -50,
              right: 0,
              backgroundColor: alpha('#FFFFFF', 0.9),
              '&:hover': {
                backgroundColor: '#FFFFFF',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Full Size Image */}
          {blobUrl && (
            <img
              src={blobUrl}
              alt={alt}
              style={{
                maxWidth: '95vw',
                maxHeight: '95vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                cursor: 'zoom-out',
              }}
              onClick={handleZoomClose}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}

QuestionImage.propTypes = {
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
  sx: PropTypes.object,
};

export default QuestionImage;
