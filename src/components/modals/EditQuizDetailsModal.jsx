// Edit Quiz Details Modal
// Modal for editing quiz basic information
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  alpha,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';
import QuizCraftButton from '../buttons/QuizCraftButton';
import {
  QUIZ_CATEGORIES,
  DIFFICULTY_LABELS,
  QUIZ_VALIDATION,
} from '../../constants/QuizConstants';
import { toast } from 'react-hot-toast';

/**
 * EditQuizDetailsModal Component
 * Modal for editing quiz details with pre-filled fields
 * @param {boolean} open - Whether modal is open
 * @param {function} onClose - Function to close modal
 * @param {object} quiz - Quiz object with current data
 * @param {function} onSave - Function to save updates
 * @param {boolean} isLoading - Loading state
 */
function EditQuizDetailsModal({ open, onClose, quiz, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    time_limit_minutes: '',
    passing_score: '70',
    is_public: true,
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Populate form when quiz changes
  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        category: quiz.category || '',
        difficulty: quiz.difficulty || '',
        time_limit_minutes: quiz.time_limit_minutes?.toString() || '',
        passing_score: quiz.passing_score?.toString() || '70',
        is_public: quiz.is_public ?? true,
        tags: quiz.tags || [],
      });
    }
  }, [quiz]);

  // Handle input change
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

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
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < QUIZ_VALIDATION.TITLE_MIN_LENGTH) {
      newErrors.title = `Title must be at least ${QUIZ_VALIDATION.TITLE_MIN_LENGTH} characters`;
    } else if (formData.title.length > QUIZ_VALIDATION.TITLE_MAX_LENGTH) {
      newErrors.title = `Title must not exceed ${QUIZ_VALIDATION.TITLE_MAX_LENGTH} characters`;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Difficulty validation
    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }

    // Time limit validation (optional)
    if (formData.time_limit_minutes) {
      const timeLimit = parseInt(formData.time_limit_minutes);
      if (isNaN(timeLimit)) {
        newErrors.time_limit_minutes = 'Time limit must be a number';
      } else if (
        timeLimit < QUIZ_VALIDATION.MIN_TIME_LIMIT ||
        timeLimit > QUIZ_VALIDATION.MAX_TIME_LIMIT
      ) {
        newErrors.time_limit_minutes = `Time limit must be between ${QUIZ_VALIDATION.MIN_TIME_LIMIT} and ${QUIZ_VALIDATION.MAX_TIME_LIMIT} minutes`;
      }
    }

    // Passing score validation
    if (formData.passing_score) {
      const passingScore = parseInt(formData.passing_score);
      if (isNaN(passingScore)) {
        newErrors.passing_score = 'Passing score must be a number';
      } else if (
        passingScore < QUIZ_VALIDATION.MIN_PASSING_SCORE ||
        passingScore > QUIZ_VALIDATION.MAX_PASSING_SCORE
      ) {
        newErrors.passing_score = `Passing score must be between ${QUIZ_VALIDATION.MIN_PASSING_SCORE} and ${QUIZ_VALIDATION.MAX_PASSING_SCORE}`;
      }
    }

    // Description validation (optional)
    if (
      formData.description &&
      formData.description.length > QUIZ_VALIDATION.DESCRIPTION_MAX_LENGTH
    ) {
      newErrors.description = `Description must not exceed ${QUIZ_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare data for API
    const updates = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      is_public: formData.is_public,
      passing_score: formData.passing_score ? parseInt(formData.passing_score) : 70,
    };

    // Add optional fields
    if (formData.time_limit_minutes) {
      updates.time_limit_minutes = parseInt(formData.time_limit_minutes);
    }

    // Add tags if provided
    if (formData.tags.length > 0) {
      updates.tags = formData.tags;
    }

    await onSave(updates);
  };

  // Handle close
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#43e97b',
      medium: '#fa8231',
      hard: '#f5576c',
    };
    return colors[difficulty] || '#667eea';
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
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Edit Quiz Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your quiz information
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={isLoading}
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: alpha('#000', 0.05) },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3, backgroundColor: '#F8F9FA' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Section 1: Basic Info */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2.5,
                border: '1px solid #E8E8E8',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: '#667eea',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3436', fontSize: '1.1rem' }}>
                  Basic Information
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <QuizCraftTextInput
                  placeholder="e.g., JavaScript Fundamentals Quiz"
                  value={formData.title}
                  onChange={handleChange('title')}
                  error={!!errors.title}
                  helperText={errors.title || 'Give your quiz a clear, descriptive title'}
                  fullWidth
                  autoFocus
                  label="Quiz Title *"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F9FA',
                    },
                  }}
                />
                <QuizCraftTextInput
                  placeholder="What will participants learn from this quiz?"
                  value={formData.description}
                  onChange={handleChange('description')}
                  error={!!errors.description}
                  helperText={errors.description || 'Optional: Add context about your quiz'}
                  multiline
                  rows={3}
                  fullWidth
                  label="Description"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8F9FA',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Section 2: Classification */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2.5,
                border: '1px solid #E8E8E8',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: '#667eea',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3436', fontSize: '1.1rem' }}>
                  Classification
                </Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    select
                    value={formData.category}
                    onChange={handleChange('category')}
                    error={!!errors.category}
                    helperText={errors.category || 'Choose the main topic'}
                    fullWidth
                    label="Category *"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8F9FA',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a category</em>
                    </MenuItem>
                    {QUIZ_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </QuizCraftTextInput>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    select
                    value={formData.difficulty}
                    onChange={handleChange('difficulty')}
                    error={!!errors.difficulty}
                    helperText={errors.difficulty || 'Set the difficulty level'}
                    fullWidth
                    label="Difficulty Level *"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8F9FA',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select difficulty</em>
                    </MenuItem>
                    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: getDifficultyColor(key),
                            }}
                          />
                          {label}
                        </Box>
                      </MenuItem>
                    ))}
                  </QuizCraftTextInput>
                </Grid>
              </Grid>
            </Box>

            {/* Section 3: Settings */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2.5,
                border: '1px solid #E8E8E8',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: '#667eea',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3436', fontSize: '1.1rem' }}>
                  Quiz Settings
                </Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    placeholder="e.g., 30"
                    type="number"
                    value={formData.time_limit_minutes}
                    onChange={handleChange('time_limit_minutes')}
                    error={!!errors.time_limit_minutes}
                    helperText={errors.time_limit_minutes || 'Leave empty for no time limit'}
                    fullWidth
                    label="Time Limit (minutes)"
                    inputProps={{
                      min: QUIZ_VALIDATION.MIN_TIME_LIMIT,
                      max: QUIZ_VALIDATION.MAX_TIME_LIMIT,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8F9FA',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    type="number"
                    value={formData.passing_score}
                    onChange={handleChange('passing_score')}
                    error={!!errors.passing_score}
                    helperText={errors.passing_score || 'Minimum score to pass'}
                    fullWidth
                    label="Passing Score (%) *"
                    inputProps={{
                      min: QUIZ_VALIDATION.MIN_PASSING_SCORE,
                      max: QUIZ_VALIDATION.MAX_PASSING_SCORE,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F8F9FA',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#636E72',
                        fontWeight: 600,
                        mb: 1,
                        display: 'block',
                      }}
                    >
                      Tags
                    </Typography>
                    <TextField
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyPress}
                      fullWidth
                      size="small"
                      slotProps={{
                        input: {
                          endAdornment: tagInput.trim() && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={addTag}
                                sx={{
                                  color: '#667eea',
                                  '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  },
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#F8F9FA',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#636E72',
                        mt: 0.5,
                        display: 'block',
                      }}
                    >
                      Press Enter or click + to add tags. Click tags to remove them.
                    </Typography>
                    {formData.tags.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        {formData.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => removeTag(tag)}
                            sx={{
                              backgroundColor: '#667eea',
                              color: '#FFFFFF',
                              fontWeight: 500,
                              '& .MuiChip-deleteIcon': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: '#FFFFFF',
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Section 4: Visibility */}
            <Box
              sx={{
                p: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2.5,
                border: '1px solid #E8E8E8',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    backgroundColor: '#667eea',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3436', fontSize: '1.1rem' }}>
                  Visibility
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2.5,
                  border: '2px solid',
                  borderColor: formData.is_public ? '#667eea' : '#E0E0E0',
                  borderRadius: 2,
                  backgroundColor: formData.is_public ? alpha('#667eea', 0.04) : '#F8F9FA',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#667eea',
                    backgroundColor: alpha('#667eea', 0.06),
                  },
                }}
                onClick={() => handleChange('is_public')({ target: { type: 'checkbox', checked: !formData.is_public } })}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_public}
                      onChange={handleChange('is_public')}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Make this quiz public
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                        Anyone can discover and take this quiz
                      </Typography>
                    </Box>
                  }
                />
              </Box>
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
          disabled={isLoading}
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
          onClick={handleSubmit}
          loading={isLoading}
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
          Save Changes
        </QuizCraftButton>
      </DialogActions>
    </Dialog>
  );
}

EditQuizDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quiz: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EditQuizDetailsModal;
