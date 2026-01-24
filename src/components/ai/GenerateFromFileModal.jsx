// Generate From File Modal Component
// AI feature: Generate quiz from uploaded documents (PDF/DOCX/TXT)
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
import TagInput from '../inputs/TagInput';
import useNetReq from '../../hooks/NetworkRequest';
import { generateQuizFromFile } from '../../services/ai/AIServices';
import {
  AI_DIFFICULTY_LEVELS,
  AI_DIFFICULTY_LABELS,
  AI_QUESTION_TYPES,
  AI_QUESTION_TYPE_LABELS,
  AI_VALIDATION,
} from '../../constants/AIConstants';
import GenerationStatusModal from './GenerationStatusModal';

/**
 * GenerateFromFileModal Component
 * Modal for generating quiz from uploaded documents
 */
function GenerateFromFileModal({ open, onClose }) {
  const navigate = useNavigate();
  const { fetchData } = useNetReq();

  // Form state
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    tags: [],
    num_questions: 10,
    difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
    question_type: AI_QUESTION_TYPES.MIXED,
    time_limit_minutes: 30,
    passing_score_percentage: 70,
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
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
    const response = await generateQuizFromFile(fetchData, abortRef, {
      file: formData.file,
      config: {
        num_questions: parseInt(formData.num_questions),
        difficulty: formData.difficulty,
        question_type: formData.question_type,
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
        setGenerationId(genId);
        setStatusModalOpen(true);
        toast.success('Quiz generation started! This may take a few moments.');
      } else {
        console.error('Generation ID not found in response:', response);
        toast.error('Failed to start generation: No generation ID received');
      }
    } else {
      toast.error(response.error?.message || 'Failed to start quiz generation');
    }
  };

  // Handle generation completion
  const handleGenerationComplete = (quizId) => {
    setStatusModalOpen(false);
    onClose();
    // Reset form
    setFormData({
      file: null,
      title: '',
      description: '',
      tags: [],
      num_questions: 10,
      difficulty: AI_DIFFICULTY_LEVELS.MEDIUM,
      question_type: AI_QUESTION_TYPES.MIXED,
      time_limit_minutes: 30,
      passing_score_percentage: 70,
    });
    // Navigate to quiz edit page
    navigate(`/quizzes/${quizId}/edit`);
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DocumentIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Generate Quiz from Documents
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Upload PDF, DOCX, or TXT study materials
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
                {/* Title */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Quiz Title *"
                    placeholder="e.g., History Chapter 3 Quiz"
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
            {isGenerating ? 'Starting Generation...' : 'Generate Quiz'}
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Generation Status Modal */}
      {generationId && (
        <GenerationStatusModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          generationId={generationId}
          onComplete={handleGenerationComplete}
        />
      )}
    </>
  );
}

GenerateFromFileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GenerateFromFileModal;
