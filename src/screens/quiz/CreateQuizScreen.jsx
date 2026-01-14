// Create Quiz Screen
// Form to create new quiz
// Following Phoenix pattern

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import {
  QUIZ_CATEGORIES,
  DIFFICULTY_LABELS,
  QUIZ_VALIDATION,
} from '../../constants/QuizConstants';
import { toast } from 'react-hot-toast';

function CreateQuizScreen() {
  const navigate = useNavigate();
  const { createQuiz, isLoading } = useQuiz();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    time_limit_minutes: '',
    passing_score: '',
    is_public: false,
    tags: '',
  });

  const [errors, setErrors] = useState({});

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

    // Time limit validation
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

    // Description validation
    if (
      formData.description &&
      formData.description.length > QUIZ_VALIDATION.DESCRIPTION_MAX_LENGTH
    ) {
      newErrors.description = `Description must not exceed ${QUIZ_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field) => (e) => {
    const value = field === 'is_public' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare quiz data
    const quizData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      difficulty: formData.difficulty,
      time_limit_minutes: formData.time_limit_minutes
        ? parseInt(formData.time_limit_minutes)
        : null,
      passing_score: formData.passing_score
        ? parseInt(formData.passing_score)
        : null,
      is_public: formData.is_public,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    };

    const response = await createQuiz(quizData);

    if (response.success) {
      toast.success('Quiz created successfully! Now add questions.');
      // Navigate to edit screen to add questions
      // Handle both response.data.id and response.data.data.id formats
      const quizId = response.data?.id || response.data?.data?.id;
      if (quizId) {
        navigate(buildRoute(ROUTES.QUIZ_EDIT, { id: quizId }));
      } else {
        console.error('Quiz ID not found in response:', response);
        toast.error('Quiz created but unable to navigate to edit page');
      }
    } else {
      toast.error(response.error || 'Failed to create quiz');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(ROUTES.QUIZ_LIST);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Create New Quiz
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Fill in the details below to create your quiz
          </Typography>
        </Box>

        {/* Form Card */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Quiz Title"
                    value={formData.title}
                    onChange={handleChange('title')}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                    required
                    fullWidth
                    autoFocus
                    placeholder="Enter a descriptive title for your quiz"
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe what your quiz is about"
                  />
                </Grid>

                {/* Category and Difficulty */}
                <Grid item xs={12} md={6}>
                  <QuizCraftTextInput
                    select
                    label="Category"
                    value={formData.category}
                    onChange={handleChange('category')}
                    error={Boolean(errors.category)}
                    helperText={errors.category}
                    required
                    fullWidth
                  >
                    <MenuItem value="">Select a category</MenuItem>
                    {QUIZ_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </QuizCraftTextInput>
                </Grid>

                <Grid item xs={12} md={6}>
                  <QuizCraftTextInput
                    select
                    label="Difficulty"
                    value={formData.difficulty}
                    onChange={handleChange('difficulty')}
                    error={Boolean(errors.difficulty)}
                    helperText={errors.difficulty}
                    required
                    fullWidth
                  >
                    <MenuItem value="">Select difficulty</MenuItem>
                    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </QuizCraftTextInput>
                </Grid>

                {/* Time Limit and Passing Score */}
                <Grid item xs={12} md={6}>
                  <QuizCraftTextInput
                    label="Time Limit (minutes)"
                    type="number"
                    value={formData.time_limit_minutes}
                    onChange={handleChange('time_limit_minutes')}
                    error={Boolean(errors.time_limit_minutes)}
                    helperText={
                      errors.time_limit_minutes ||
                      'Optional: Set a time limit for the quiz'
                    }
                    fullWidth
                    placeholder="e.g., 30"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <QuizCraftTextInput
                    label="Passing Score (%)"
                    type="number"
                    value={formData.passing_score}
                    onChange={handleChange('passing_score')}
                    error={Boolean(errors.passing_score)}
                    helperText={
                      errors.passing_score ||
                      'Optional: Minimum percentage to pass (0-100)'
                    }
                    fullWidth
                    placeholder="e.g., 70"
                  />
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <QuizCraftTextInput
                    label="Tags"
                    value={formData.tags}
                    onChange={handleChange('tags')}
                    fullWidth
                    placeholder="Enter tags separated by commas (e.g., javascript, beginner, web dev)"
                    helperText="Tags help users find your quiz"
                  />
                </Grid>

                {/* Is Public Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.is_public}
                        onChange={handleChange('is_public')}
                        sx={{
                          color: '#6C5CE7',
                          '&.Mui-checked': {
                            color: '#6C5CE7',
                          },
                        }}
                      />
                    }
                    label="Make this quiz publicly searchable"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ ml: 4, mt: -1 }}
                  >
                    Public quizzes can be discovered and taken by anyone
                  </Typography>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'flex-end',
                      mt: 2,
                    }}
                  >
                    <QuizCraftButton
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </QuizCraftButton>
                    <QuizCraftButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                      sx={{
                        background:
                          'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)',
                        },
                      }}
                    >
                      Create Quiz
                    </QuizCraftButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default CreateQuizScreen;
