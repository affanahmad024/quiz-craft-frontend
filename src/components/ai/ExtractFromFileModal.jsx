// Extract From File Modal Component
// AI feature: Extract quiz from images/PDFs of existing quizzes
// Following Phoenix pattern

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  IconButton,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CameraAlt as CameraIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';
import TagInput from '../inputs/TagInput';
import useNetReq from '../../hooks/NetworkRequest';
import { extractQuizFromFile } from '../../services/ai/AIServices';
import { AI_VALIDATION } from '../../constants/AIConstants';
import GenerationStatusModal from './GenerationStatusModal';

/**
 * ExtractFromFileModal Component
 * Modal for extracting quiz from images/PDFs
 */
function ExtractFromFileModal({ open, onClose }) {
  const navigate = useNavigate();
  const { fetchData } = useNetReq();

  // Form state
  const [formData, setFormData] = useState({
    file: null,
    previewUrl: null,
    title: '',
    description: '',
    tags: [],
    time_limit_minutes: 30,
    passing_score_percentage: 70,
  });

  // UI state
  const [isExtracting, setIsExtracting] = useState(false);
  const [generationId, setGenerationId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // Handle field change
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Handle tags change
  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!AI_VALIDATION.ACCEPTED_FILE_TYPES.EXTRACT.includes(extension)) {
      toast.error(`Please upload a PDF or image file (JPG, PNG)`);
      return;
    }

    // Validate file size
    const maxSizeBytes = AI_VALIDATION.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${AI_VALIDATION.MAX_FILE_SIZE_MB}MB`);
      return;
    }

    // Create preview for images
    let preview = null;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    setFormData((prev) => ({ ...prev, file, previewUrl: preview }));
  };

  // Handle file removal
  const handleFileRemove = () => {
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    setFormData((prev) => ({ ...prev, file: null, previewUrl: null }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.file) {
      toast.error('Please upload a quiz image or PDF');
      return false;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a quiz title');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleExtract = async () => {
    if (!validateForm()) return;

    setIsExtracting(true);

    const abortRef = { current: null };
    const response = await extractQuizFromFile(fetchData, abortRef, {
      file: formData.file,
      config: {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        time_limit_minutes: formData.time_limit_minutes || undefined,
        passing_score_percentage: formData.passing_score_percentage || undefined,
      },
    });

    setIsExtracting(false);

    if (response.success) {
      // Handle nested data structure: response.data.data.generation_id or response.data.generation_id
      const genId = response.data?.data?.generation_id || response.data?.generation_id;
      if (genId) {
        setGenerationId(genId);
        setStatusModalOpen(true);
        toast.success('Quiz extraction started! This may take a few moments.');
      } else {
        console.error('Generation ID not found in response:', response);
        toast.error('Failed to start extraction: No generation ID received');
      }
    } else {
      toast.error(response.error?.message || 'Failed to start quiz extraction');
    }
  };

  // Handle extraction completion
  const handleExtractionComplete = (quizId) => {
    setStatusModalOpen(false);
    onClose();
    // Reset form
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    setFormData({
      file: null,
      previewUrl: null,
      title: '',
      description: '',
      tags: [],
      time_limit_minutes: 30,
      passing_score_percentage: 70,
    });
    // Navigate to quiz edit page
    navigate(`/quizzes/${quizId}/edit`);
  };

  // Handle close
  const handleClose = () => {
    if (!isExtracting) {
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
            pt: 3,
            px: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CameraIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Extract Quiz from Image
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Upload a photo or PDF of an existing quiz
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isExtracting}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 3, backgroundColor: '#F8F9FA' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* File Upload */}
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Quiz Image or PDF *
              </Typography>

              {!formData.file ? (
                <Box
                  sx={{
                    border: '2px dashed #E8E8E8',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: alpha('#F8F9FA', 0.5),
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#4facfe',
                      backgroundColor: alpha('#4facfe', 0.05),
                    },
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#4facfe', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Click to upload quiz image or PDF
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, JPG, or PNG up to {AI_VALIDATION.MAX_FILE_SIZE_MB}MB
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: '2px solid #E8E8E8',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {formData.previewUrl ? (
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: 1,
                          overflow: 'hidden',
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E8E8E8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={formData.previewUrl}
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
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          backgroundColor: alpha('#4facfe', 0.1),
                          border: '1px solid #E8E8E8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 32, color: '#4facfe' }} />
                      </Box>
                    )}

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {formData.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(formData.file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={handleFileRemove}
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
                </Box>
              )}
            </Box>

            {/* Quiz Configuration */}
            <Box
              sx={{
                p: 2.5,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                border: '1px solid #E8E8E8',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quiz Details
              </Typography>

              <Grid container spacing={2}>
                {/* Title */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Quiz Title *"
                    placeholder="e.g., Math Test Chapter 2"
                    value={formData.title}
                    onChange={handleChange('title')}
                    fullWidth
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Description (Optional)"
                    placeholder="Brief description of the quiz..."
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <TagInput
                    value={formData.tags}
                    onChange={handleTagsChange}
                    placeholder="Add tags (press Enter)"
                  />
                </Grid>

                {/* Time Limit */}
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    label="Time Limit (minutes)"
                    type="number"
                    value={formData.time_limit_minutes}
                    onChange={handleChange('time_limit_minutes')}
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                {/* Passing Score */}
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    label="Passing Score (%)"
                    type="number"
                    value={formData.passing_score_percentage}
                    onChange={handleChange('passing_score_percentage')}
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha('#4facfe', 0.05),
                  border: '1px solid',
                  borderColor: alpha('#4facfe', 0.2),
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> AI will extract all questions and answers from the uploaded image or PDF. Make sure the quiz content is clearly visible and readable.
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#FAFBFC',
          }}
        >
          <QuizCraftButton
            variant="outlined"
            onClick={handleClose}
            disabled={isExtracting}
            sx={{
              borderColor: '#DFE6E9',
              color: '#636E72',
              '&:hover': {
                borderColor: '#B2BEC3',
                backgroundColor: alpha('#636E72', 0.05),
              },
            }}
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            onClick={handleExtract}
            loading={isExtracting}
            disabled={isExtracting}
            startIcon={isExtracting ? <CircularProgress size={20} color="inherit" /> : <CameraIcon />}
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #3e9bef 0%, #00d9e0 100%)',
              },
            }}
          >
            {isExtracting ? 'Starting Extraction...' : 'Extract Quiz'}
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Generation Status Modal */}
      {generationId && (
        <GenerationStatusModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          generationId={generationId}
          onComplete={handleExtractionComplete}
        />
      )}
    </>
  );
}

ExtractFromFileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExtractFromFileModal;
