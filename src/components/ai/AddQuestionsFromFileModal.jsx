// Add Questions From File Modal Component
// AI feature: Add questions to existing quiz from documents
// Following Phoenix pattern

import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  MenuItem,
  Grid,
  IconButton,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Description as DocumentIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';
import useNetReq from '../../hooks/NetworkRequest';
import { addQuestionsFromFile } from '../../services/ai/AIServices';
import {
  AI_DIFFICULTY_LEVELS,
  AI_DIFFICULTY_LABELS,
  AI_QUESTION_TYPES,
  AI_QUESTION_TYPE_LABELS,
  AI_VALIDATION,
} from '../../constants/AIConstants';

/**
 * AddQuestionsFromFileModal Component
 * Modal for adding questions from uploaded documents
 */
function AddQuestionsFromFileModal({ open, onClose, quizId, quizTitle }) {
  const { fetchData } = useNetReq();

  // Form state
  const [formData, setFormData] = useState({
    file: null,
    num_questions: 10,
    difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
    question_type: AI_QUESTION_TYPES.MIXED,
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle field change
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!AI_VALIDATION.ACCEPTED_FILE_TYPES.GENERATE.includes(extension)) {
      toast.error(`Please upload a PDF, DOCX, or TXT file`);
      return;
    }

    // Validate file size
    const maxSizeBytes = AI_VALIDATION.MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${AI_VALIDATION.MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
  };

  // Handle file removal
  const handleFileRemove = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.file) {
      toast.error('Please upload a document file');
      return false;
    }

    if (
      formData.num_questions < AI_VALIDATION.MIN_QUESTIONS ||
      formData.num_questions > AI_VALIDATION.MAX_QUESTIONS
    ) {
      toast.error(
        `Number of questions must be between ${AI_VALIDATION.MIN_QUESTIONS} and ${AI_VALIDATION.MAX_QUESTIONS}`
      );
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleGenerate = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    const abortRef = { current: null };
    const response = await addQuestionsFromFile(fetchData, abortRef, {
      quizId,
      file: formData.file,
      config: {
        num_questions: parseInt(formData.num_questions),
        difficulty: formData.difficulty,
        question_type: formData.question_type,
      },
    });

    setIsGenerating(false);

    if (response.success) {
      toast.success('Questions are being generated! We\'ll notify you once completed.', {
        duration: 5000,
      });
      // Reset form
      setFormData({
        file: null,
        num_questions: 10,
        difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
        question_type: AI_QUESTION_TYPES.MIXED,
      });
      onClose();
    } else {
      toast.error(response.error?.message || 'Failed to start question generation');
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  return (
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DocumentIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Add Questions from Documents
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Adding to: <strong>{quizTitle}</strong>
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} disabled={isGenerating} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3, backgroundColor: '#F8F9FA' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* File Upload */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Document File *
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
                    borderColor: '#f093fb',
                    backgroundColor: alpha('#f093fb', 0.05),
                  },
                }}
                component="label"
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: '#f093fb', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Click to upload document
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF, DOCX, or TXT up to {AI_VALIDATION.MAX_FILE_SIZE_MB}MB
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DocumentIcon sx={{ fontSize: 40, color: '#f093fb' }} />
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

          {/* AI Configuration */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              border: '1px solid #E8E8E8',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Generation Options
            </Typography>

            <Grid container spacing={2}>
              {/* Number of Questions */}
              <Grid item xs={12} sm={4}>
                <QuizCraftTextInput
                  label="Number of Questions *"
                  type="number"
                  value={formData.num_questions}
                  onChange={handleChange('num_questions')}
                  fullWidth
                  inputProps={{
                    min: AI_VALIDATION.MIN_QUESTIONS,
                    max: AI_VALIDATION.MAX_QUESTIONS,
                  }}
                  helperText={`${AI_VALIDATION.MIN_QUESTIONS}-${AI_VALIDATION.MAX_QUESTIONS} questions`}
                />
              </Grid>

              {/* Difficulty */}
              <Grid item xs={12} sm={4}>
                <QuizCraftTextInput
                  label="Difficulty Level *"
                  select
                  value={formData.difficulty}
                  onChange={handleChange('difficulty')}
                  fullWidth
                >
                  {Object.entries(AI_DIFFICULTY_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </QuizCraftTextInput>
              </Grid>

              {/* Question Type */}
              <Grid item xs={12} sm={4}>
                <QuizCraftTextInput
                  label="Question Type *"
                  select
                  value={formData.question_type}
                  onChange={handleChange('question_type')}
                  fullWidth
                >
                  {Object.entries(AI_QUESTION_TYPE_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </QuizCraftTextInput>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha('#f093fb', 0.05),
              border: '1px solid',
              borderColor: alpha('#f093fb', 0.2),
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Questions will be added to your existing quiz. You'll be notified once generation is complete.
            </Typography>
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
          disabled={isGenerating}
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
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DocumentIcon />}
          sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #e082ea 0%, #e44658 100%)',
            },
          }}
        >
          {isGenerating ? 'Starting...' : 'Add Questions'}
        </QuizCraftButton>
      </DialogActions>
    </Dialog>
  );
}

AddQuestionsFromFileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quizId: PropTypes.string.isRequired,
  quizTitle: PropTypes.string.isRequired,
};

export default AddQuestionsFromFileModal;
