// Add Questions From Text Modal Component
// AI feature: Add questions to existing quiz from text
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
  TextField,
  MenuItem,
  Grid,
  IconButton,
  alpha,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';
import useNetReq from '../../hooks/NetworkRequest';
import { addQuestionsFromText } from '../../services/ai/AIServices';
import {
  AI_DIFFICULTY_LEVELS,
  AI_DIFFICULTY_LABELS,
  AI_QUESTION_TYPES,
  AI_QUESTION_TYPE_LABELS,
  AI_VALIDATION,
} from '../../constants/AIConstants';

/**
 * AddQuestionsFromTextModal Component
 * Modal for adding questions to existing quiz from text
 */
function AddQuestionsFromTextModal({ open, onClose, quizId, quizTitle }) {
  const { fetchData } = useNetReq();

  // Form state
  const [formData, setFormData] = useState({
    text: '',
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

  // Validate form
  const validateForm = () => {
    if (!formData.text.trim()) {
      toast.error('Please enter some text content');
      return false;
    }

    if (formData.text.length > AI_VALIDATION.MAX_TEXT_LENGTH) {
      toast.error(`Text content must not exceed ${AI_VALIDATION.MAX_TEXT_LENGTH} characters`);
      return false;
    }

    if (formData.text.length < 100) {
      toast.error('Text content must be at least 100 characters');
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
    const response = await addQuestionsFromText(fetchData, abortRef, {
      quizId,
      text: formData.text.trim(),
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
        text: '',
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Add Questions from Text
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
          {/* Text Content */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Text Content *
            </Typography>
            <TextField
              placeholder="Paste your study notes, article, or any text content here..."
              value={formData.text}
              onChange={handleChange('text')}
              multiline
              rows={8}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF',
                },
              }}
              helperText={`${formData.text.length}/${AI_VALIDATION.MAX_TEXT_LENGTH} characters (min 100)`}
            />
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
              backgroundColor: alpha('#667eea', 0.05),
              border: '1px solid',
              borderColor: alpha('#667eea', 0.2),
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
          startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
            },
          }}
        >
          {isGenerating ? 'Starting...' : 'Add Questions'}
        </QuizCraftButton>
      </DialogActions>
    </Dialog>
  );
}

AddQuestionsFromTextModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quizId: PropTypes.string.isRequired,
  quizTitle: PropTypes.string.isRequired,
};

export default AddQuestionsFromTextModal;
