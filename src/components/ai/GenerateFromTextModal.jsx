// Generate From Text Modal Component
// AI feature: Generate quiz from pasted text content
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
import TagInput from '../inputs/TagInput';
import useNetReq from '../../hooks/NetworkRequest';
import { generateQuizFromText, getGenerationStatus } from '../../services/ai/AIServices';
import {
  AI_DIFFICULTY_LEVELS,
  AI_DIFFICULTY_LABELS,
  AI_QUESTION_TYPES,
  AI_QUESTION_TYPE_LABELS,
  AI_VALIDATION,
} from '../../constants/AIConstants';

/**
 * GenerateFromTextModal Component
 * Modal for generating quiz from pasted text
 */
function GenerateFromTextModal({ open, onClose }) {
  const navigate = useNavigate();
  const { fetchData } = useNetReq();

  // Form state
  const [formData, setFormData] = useState({
    text: '',
    category: '', // AI generation option (what topic/category the quiz is about)
    title: '', // Quiz metadata (actual quiz title)
    description: '',
    tags: [],
    num_questions: 10,
    difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
    question_type: AI_QUESTION_TYPES.MIXED,
    language: 'en', // AI generation option (language code)
    time_limit_minutes: 30,
    passing_score_percentage: 70,
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle field change
  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Handle tags change
  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, tags }));
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

    if (!formData.category.trim()) {
      toast.error('Please enter a quiz category (e.g., "Biology", "History")');
      return false;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a quiz title');
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
    const response = await generateQuizFromText(fetchData, abortRef, {
      text: formData.text.trim(),
      config: {
        // AI generation options
        category: formData.category.trim(),
        num_questions: parseInt(formData.num_questions),
        difficulty: formData.difficulty,
        question_type: formData.question_type,
        language: formData.language || 'en',
        // Quiz metadata (stored for later use)
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        time_limit_minutes: formData.time_limit_minutes || undefined,
        passing_score_percentage: formData.passing_score_percentage || undefined,
      },
    });

    setIsGenerating(false);

    if (response.success) {
      // Handle nested data structure: response.data.data.generation_id or response.data.generation_id
      const genId = response.data?.data?.generation_id || response.data?.generation_id;
      if (genId) {
        toast.success('Quiz generation started! We\'ll notify you when it\'s complete.');
        onClose();
        // Reset form
        setFormData({
          text: '',
          category: '',
          title: '',
          description: '',
          tags: [],
          num_questions: 10,
          difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
          question_type: AI_QUESTION_TYPES.MIXED,
          language: 'en',
          time_limit_minutes: 30,
          passing_score_percentage: 70,
        });
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        console.error('Generation ID not found in response:', response);
        toast.error('Failed to start generation: No generation ID received');
      }
    } else {
      toast.error(response.error?.message || 'Failed to start quiz generation');
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isGenerating) {
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Generate Quiz from Text
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Paste your study notes or content below
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={isGenerating}
            sx={{ color: 'white' }}
          >
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
                helperText={`${formData.text.length}/${AI_VALIDATION.MAX_TEXT_LENGTH} characters`}
              />
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
                Quiz Configuration
              </Typography>

              <Grid container spacing={2}>
                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    label="Category *"
                    placeholder="e.g., Biology, History, Math"
                    value={formData.category}
                    onChange={handleChange('category')}
                    fullWidth
                    helperText="Topic or subject area for AI generation"
                  />
                </Grid>

                {/* Language */}
                <Grid item xs={12} sm={6}>
                  <QuizCraftTextInput
                    label="Language *"
                    select
                    value={formData.language}
                    onChange={handleChange('language')}
                    fullWidth
                    helperText="Language for quiz generation"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="it">Italian</MenuItem>
                    <MenuItem value="pt">Portuguese</MenuItem>
                    <MenuItem value="ru">Russian</MenuItem>
                    <MenuItem value="zh">Chinese</MenuItem>
                    <MenuItem value="ja">Japanese</MenuItem>
                    <MenuItem value="ko">Korean</MenuItem>
                    <MenuItem value="ar">Arabic</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                  </QuizCraftTextInput>
                </Grid>

                {/* Title */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Quiz Title *"
                    placeholder="e.g., Biology Chapter 5 Quiz"
                    value={formData.title}
                    onChange={handleChange('title')}
                    fullWidth
                    helperText="Display title for your quiz"
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

                {/* Number of Questions */}
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
            {isGenerating ? 'Starting Generation...' : 'Generate Quiz'}
          </QuizCraftButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

GenerateFromTextModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GenerateFromTextModal;
