// Edit Quiz Screen
// Edit quiz details and manage questions
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import QuestionCard from '../../components/quiz/QuestionCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import {
  QUIZ_CATEGORIES,
  DIFFICULTY_LABELS,
  QUIZ_VALIDATION,
  QUESTION_TYPE_LABELS,
  MIN_ANSWERS_REQUIRED,
  MAX_ANSWERS_ALLOWED,
} from '../../constants/QuizConstants';
import { toast } from 'react-hot-toast';

function EditQuizScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentQuiz,
    isLoading,
    getQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState(0);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteQuestionDialogOpen, setDeleteQuestionDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Quiz Details Form
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    time_limit_minutes: '',
    passing_score: '',
    is_public: false,
    tags: '',
  });
  const [quizErrors, setQuizErrors] = useState({});

  // Question Form
  const [questionFormData, setQuestionFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    points: '1',
    explanation: '',
    answers: [
      { answer_text: '', is_correct: false },
      { answer_text: '', is_correct: false },
    ],
  });
  const [questionErrors, setQuestionErrors] = useState({});

  // Fetch quiz on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getQuiz(id, true);
      if (!response.success) {
        toast.error(response.error || 'Failed to load quiz');
        navigate(ROUTES.QUIZ_LIST);
      }
    };
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Populate form when quiz loads
  useEffect(() => {
    if (currentQuiz) {
      setQuizFormData({
        title: currentQuiz.title || '',
        description: currentQuiz.description || '',
        category: currentQuiz.category || '',
        difficulty: currentQuiz.difficulty || '',
        time_limit_minutes: currentQuiz.time_limit_minutes?.toString() || '',
        passing_score: currentQuiz.passing_score?.toString() || '',
        is_public: currentQuiz.is_public || false,
        tags: currentQuiz.tags?.join(', ') || '',
      });
    }
  }, [currentQuiz]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Validate quiz form
  const validateQuizForm = () => {
    const newErrors = {};

    if (!quizFormData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (quizFormData.title.length < QUIZ_VALIDATION.TITLE_MIN_LENGTH) {
      newErrors.title = `Title must be at least ${QUIZ_VALIDATION.TITLE_MIN_LENGTH} characters`;
    } else if (quizFormData.title.length > QUIZ_VALIDATION.TITLE_MAX_LENGTH) {
      newErrors.title = `Title must not exceed ${QUIZ_VALIDATION.TITLE_MAX_LENGTH} characters`;
    }

    if (!quizFormData.category) {
      newErrors.category = 'Category is required';
    }

    if (!quizFormData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }

    if (quizFormData.time_limit_minutes) {
      const timeLimit = parseInt(quizFormData.time_limit_minutes);
      if (
        isNaN(timeLimit) ||
        timeLimit < QUIZ_VALIDATION.MIN_TIME_LIMIT ||
        timeLimit > QUIZ_VALIDATION.MAX_TIME_LIMIT
      ) {
        newErrors.time_limit_minutes = `Time limit must be between ${QUIZ_VALIDATION.MIN_TIME_LIMIT} and ${QUIZ_VALIDATION.MAX_TIME_LIMIT} minutes`;
      }
    }

    if (quizFormData.passing_score) {
      const passingScore = parseInt(quizFormData.passing_score);
      if (
        isNaN(passingScore) ||
        passingScore < QUIZ_VALIDATION.MIN_PASSING_SCORE ||
        passingScore > QUIZ_VALIDATION.MAX_PASSING_SCORE
      ) {
        newErrors.passing_score = `Passing score must be between ${QUIZ_VALIDATION.MIN_PASSING_SCORE} and ${QUIZ_VALIDATION.MAX_PASSING_SCORE}`;
      }
    }

    setQuizErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle quiz form change
  const handleQuizFormChange = (field) => (e) => {
    const value = field === 'is_public' ? e.target.checked : e.target.value;
    setQuizFormData((prev) => ({ ...prev, [field]: value }));

    if (quizErrors[field]) {
      setQuizErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle quiz form submit
  const handleQuizFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateQuizForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const updates = {
      title: quizFormData.title.trim(),
      description: quizFormData.description.trim() || null,
      category: quizFormData.category,
      difficulty: quizFormData.difficulty,
      time_limit_minutes: quizFormData.time_limit_minutes
        ? parseInt(quizFormData.time_limit_minutes)
        : null,
      passing_score: quizFormData.passing_score
        ? parseInt(quizFormData.passing_score)
        : null,
      is_public: quizFormData.is_public,
      tags: quizFormData.tags
        ? quizFormData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    };

    const response = await updateQuiz(id, updates);

    if (response.success) {
      toast.success('Quiz updated successfully');
    } else {
      toast.error(response.error || 'Failed to update quiz');
    }
  };

  // Open question dialog for add
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionFormData({
      question_text: '',
      question_type: 'multiple_choice',
      points: '1',
      explanation: '',
      answers: [
        { answer_text: '', is_correct: false },
        { answer_text: '', is_correct: false },
      ],
    });
    setQuestionErrors({});
    setQuestionDialogOpen(true);
  };

  // Open question dialog for edit
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionFormData({
      question_text: question.question_text || '',
      question_type: question.question_type || 'multiple_choice',
      points: question.points?.toString() || '1',
      explanation: question.explanation || '',
      answers: question.answers?.length
        ? question.answers.map((a) => ({
            id: a.id,
            answer_text: a.answer_text || '',
            is_correct: a.is_correct || false,
          }))
        : [
            { answer_text: '', is_correct: false },
            { answer_text: '', is_correct: false },
          ],
    });
    setQuestionErrors({});
    setQuestionDialogOpen(true);
  };

  // Handle delete question
  const handleDeleteQuestion = (question) => {
    setQuestionToDelete(question);
    setDeleteQuestionDialogOpen(true);
  };

  // Confirm delete question
  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;

    const response = await deleteQuestion(questionToDelete.id);

    if (response.success) {
      toast.success('Question deleted successfully');
      setDeleteQuestionDialogOpen(false);
      setQuestionToDelete(null);
    } else {
      toast.error(response.error || 'Failed to delete question');
    }
  };

  // Handle question type change
  const handleQuestionTypeChange = (e) => {
    const newType = e.target.value;
    setQuestionFormData((prev) => {
      let newAnswers = prev.answers;

      // Adjust answers based on type
      if (newType === 'true_false') {
        newAnswers = [
          { answer_text: 'True', is_correct: false },
          { answer_text: 'False', is_correct: false },
        ];
      } else if (newType === 'short_answer') {
        newAnswers = [];
      } else if (newType === 'multiple_choice' && prev.answers.length < 2) {
        newAnswers = [
          { answer_text: '', is_correct: false },
          { answer_text: '', is_correct: false },
        ];
      }

      return {
        ...prev,
        question_type: newType,
        answers: newAnswers,
      };
    });
  };

  // Handle answer change
  const handleAnswerChange = (index, field) => (e) => {
    const value = field === 'is_correct' ? e.target.checked : e.target.value;
    setQuestionFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };

      // For true_false and single correct, uncheck others
      if (
        field === 'is_correct' &&
        value &&
        (prev.question_type === 'true_false')
      ) {
        newAnswers.forEach((ans, i) => {
          if (i !== index) ans.is_correct = false;
        });
      }

      return { ...prev, answers: newAnswers };
    });
  };

  // Handle answer radio change (for true_false)
  const handleAnswerRadioChange = (index) => {
    setQuestionFormData((prev) => {
      const newAnswers = prev.answers.map((ans, i) => ({
        ...ans,
        is_correct: i === index,
      }));
      return { ...prev, answers: newAnswers };
    });
  };

  // Add answer
  const handleAddAnswer = () => {
    if (
      questionFormData.answers.length >=
      MAX_ANSWERS_ALLOWED[questionFormData.question_type]
    ) {
      toast.error(`Maximum ${MAX_ANSWERS_ALLOWED[questionFormData.question_type]} answers allowed`);
      return;
    }

    setQuestionFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { answer_text: '', is_correct: false }],
    }));
  };

  // Remove answer
  const handleRemoveAnswer = (index) => {
    if (
      questionFormData.answers.length <=
      MIN_ANSWERS_REQUIRED[questionFormData.question_type]
    ) {
      toast.error(`Minimum ${MIN_ANSWERS_REQUIRED[questionFormData.question_type]} answers required`);
      return;
    }

    setQuestionFormData((prev) => ({
      ...prev,
      answers: prev.answers.filter((_, i) => i !== index),
    }));
  };

  // Validate question form
  const validateQuestionForm = () => {
    const newErrors = {};

    if (!questionFormData.question_text.trim()) {
      newErrors.question_text = 'Question text is required';
    }

    const points = parseInt(questionFormData.points);
    if (
      isNaN(points) ||
      points < QUIZ_VALIDATION.MIN_POINTS ||
      points > QUIZ_VALIDATION.MAX_POINTS
    ) {
      newErrors.points = `Points must be between ${QUIZ_VALIDATION.MIN_POINTS} and ${QUIZ_VALIDATION.MAX_POINTS}`;
    }

    // Validate answers
    if (questionFormData.question_type !== 'short_answer') {
      const hasCorrectAnswer = questionFormData.answers.some((a) => a.is_correct);
      if (!hasCorrectAnswer) {
        newErrors.answers = 'At least one answer must be marked as correct';
      }

      const hasEmptyAnswer = questionFormData.answers.some(
        (a) => !a.answer_text.trim()
      );
      if (hasEmptyAnswer) {
        newErrors.answers = 'All answer fields must be filled';
      }
    }

    setQuestionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit question
  const handleQuestionSubmit = async () => {
    if (!validateQuestionForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const questionData = {
      question_text: questionFormData.question_text.trim(),
      question_type: questionFormData.question_type,
      points: parseInt(questionFormData.points),
      explanation: questionFormData.explanation.trim() || null,
      answers:
        questionFormData.question_type !== 'short_answer'
          ? questionFormData.answers.map((a) => ({
              answer_text: a.answer_text.trim(),
              is_correct: a.is_correct,
            }))
          : [],
    };

    let response;
    if (editingQuestion) {
      response = await updateQuestion(editingQuestion.id, questionData);
    } else {
      response = await addQuestion(id, questionData);
    }

    if (response.success) {
      toast.success(
        editingQuestion
          ? 'Question updated successfully'
          : 'Question added successfully'
      );
      setQuestionDialogOpen(false);
      setEditingQuestion(null);
    } else {
      toast.error(response.error || 'Failed to save question');
    }
  };

  if (isLoading || !currentQuiz) {
    return <LoadingScreen message="Loading quiz..." />;
  }

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
            Edit Quiz
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {currentQuiz.title}
          </Typography>
        </Box>

        {/* Tabs Card */}
        <Card>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab label="Quiz Details" />
            <Tab label="Questions" />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {/* Quiz Details Tab */}
            {activeTab === 0 && (
              <form onSubmit={handleQuizFormSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <QuizCraftTextInput
                      label="Quiz Title"
                      value={quizFormData.title}
                      onChange={handleQuizFormChange('title')}
                      error={Boolean(quizErrors.title)}
                      helperText={quizErrors.title}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <QuizCraftTextInput
                      label="Description"
                      value={quizFormData.description}
                      onChange={handleQuizFormChange('description')}
                      error={Boolean(quizErrors.description)}
                      helperText={quizErrors.description}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <QuizCraftTextInput
                      select
                      label="Category"
                      value={quizFormData.category}
                      onChange={handleQuizFormChange('category')}
                      error={Boolean(quizErrors.category)}
                      helperText={quizErrors.category}
                      required
                      fullWidth
                    >
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
                      value={quizFormData.difficulty}
                      onChange={handleQuizFormChange('difficulty')}
                      error={Boolean(quizErrors.difficulty)}
                      helperText={quizErrors.difficulty}
                      required
                      fullWidth
                    >
                      {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </QuizCraftTextInput>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <QuizCraftTextInput
                      label="Time Limit (minutes)"
                      type="number"
                      value={quizFormData.time_limit_minutes}
                      onChange={handleQuizFormChange('time_limit_minutes')}
                      error={Boolean(quizErrors.time_limit_minutes)}
                      helperText={quizErrors.time_limit_minutes}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <QuizCraftTextInput
                      label="Passing Score (%)"
                      type="number"
                      value={quizFormData.passing_score}
                      onChange={handleQuizFormChange('passing_score')}
                      error={Boolean(quizErrors.passing_score)}
                      helperText={quizErrors.passing_score}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <QuizCraftTextInput
                      label="Tags"
                      value={quizFormData.tags}
                      onChange={handleQuizFormChange('tags')}
                      fullWidth
                      placeholder="Enter tags separated by commas"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={quizFormData.is_public}
                          onChange={handleQuizFormChange('is_public')}
                        />
                      }
                      label="Make this quiz publicly searchable"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <QuizCraftButton
                        variant="outlined"
                        onClick={() => navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id }))}
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
                        }}
                      >
                        Save Changes
                      </QuizCraftButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}

            {/* Questions Tab */}
            {activeTab === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">
                    Questions ({currentQuiz.questions?.length || 0})
                  </Typography>
                  <QuizCraftButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    sx={{
                      background:
                        'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    }}
                  >
                    Add Question
                  </QuizCraftButton>
                </Box>

                {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
                  <Stack spacing={3}>
                    {currentQuiz.questions.map((question, index) => (
                      <Box key={question.id}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Question {index + 1}
                        </Typography>
                        <QuestionCard
                          question={question}
                          editable={true}
                          onEdit={handleEditQuestion}
                          onDelete={handleDeleteQuestion}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      No Questions Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Click &quot;Add Question&quot; to create your first question
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Add/Edit Question Dialog */}
      <Dialog
        open={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </Typography>
            <IconButton onClick={() => setQuestionDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <QuizCraftTextInput
                label="Question Text"
                value={questionFormData.question_text}
                onChange={(e) =>
                  setQuestionFormData((prev) => ({
                    ...prev,
                    question_text: e.target.value,
                  }))
                }
                error={Boolean(questionErrors.question_text)}
                helperText={questionErrors.question_text}
                required
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <QuizCraftTextInput
                select
                label="Question Type"
                value={questionFormData.question_type}
                onChange={handleQuestionTypeChange}
                fullWidth
              >
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </QuizCraftTextInput>
            </Grid>

            <Grid item xs={12} md={6}>
              <QuizCraftTextInput
                label="Points"
                type="number"
                value={questionFormData.points}
                onChange={(e) =>
                  setQuestionFormData((prev) => ({
                    ...prev,
                    points: e.target.value,
                  }))
                }
                error={Boolean(questionErrors.points)}
                helperText={questionErrors.points}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <QuizCraftTextInput
                label="Explanation (Optional)"
                value={questionFormData.explanation}
                onChange={(e) =>
                  setQuestionFormData((prev) => ({
                    ...prev,
                    explanation: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={2}
                placeholder="Provide an explanation for the correct answer"
              />
            </Grid>

            {/* Answers Section */}
            {questionFormData.question_type !== 'short_answer' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Answers</Typography>
                  {questionFormData.question_type === 'multiple_choice' && (
                    <QuizCraftButton
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddAnswer}
                      disabled={
                        questionFormData.answers.length >=
                        MAX_ANSWERS_ALLOWED[questionFormData.question_type]
                      }
                    >
                      Add Answer
                    </QuizCraftButton>
                  )}
                </Box>

                {questionErrors.answers && (
                  <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
                    {questionErrors.answers}
                  </Typography>
                )}

                {questionFormData.question_type === 'true_false' ? (
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={
                        questionFormData.answers.findIndex((a) => a.is_correct)
                      }
                      onChange={(e) => handleAnswerRadioChange(parseInt(e.target.value))}
                    >
                      {questionFormData.answers.map((answer, index) => (
                        <FormControlLabel
                          key={index}
                          value={index}
                          control={<Radio />}
                          label={answer.answer_text}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Stack spacing={2}>
                    {questionFormData.answers.map((answer, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Checkbox
                          checked={answer.is_correct}
                          onChange={handleAnswerChange(index, 'is_correct')}
                          sx={{ mt: 1 }}
                        />
                        <QuizCraftTextInput
                          placeholder={`Answer ${index + 1}`}
                          value={answer.answer_text}
                          onChange={handleAnswerChange(index, 'answer_text')}
                          fullWidth
                          size="small"
                        />
                        {questionFormData.answers.length >
                          MIN_ANSWERS_REQUIRED[questionFormData.question_type] && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveAnswer(index)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <QuizCraftButton
            variant="outlined"
            onClick={() => setQuestionDialogOpen(false)}
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            onClick={handleQuestionSubmit}
            loading={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
            }}
          >
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Delete Question Dialog */}
      <Dialog
        open={deleteQuestionDialogOpen}
        onClose={() => setDeleteQuestionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Question?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this question? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            variant="outlined"
            onClick={() => setDeleteQuestionDialogOpen(false)}
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            color="error"
            onClick={confirmDeleteQuestion}
            loading={isLoading}
          >
            Delete
          </QuizCraftButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditQuizScreen;
