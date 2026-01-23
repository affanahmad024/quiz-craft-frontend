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
  Chip,
  Button,
  Divider,
  TextField,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AutoAwesome as AIIcon,
  Create as ManualIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import QuestionCard from '../../components/quiz/QuestionCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EditQuizDetailsModal from '../../components/modals/EditQuizDetailsModal';
import AddQuestionsModal from '../../components/modals/AddQuestionsModal';
import { COLORS } from '../../constants/ColorConstants';
import {
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
    bulkAddQuestions,
    updateQuestion,
    deleteQuestion,
  } = useQuiz();

  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [addQuestionsModalOpen, setAddQuestionsModalOpen] = useState(false);
  const [addMode, setAddMode] = useState(null); // 'manual' | 'ai' | null
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Manual question form
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

  // AI generation form
  const [aiFormData, setAIFormData] = useState({
    source_type: 'text',
    text_content: '',
    file_id: '',
    num_questions: '5',
    difficulty: 'medium',
    question_type: 'multiple_choice',
  });

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

  // Handle save quiz details
  const handleSaveQuizDetails = async (updates) => {
    const response = await updateQuiz(id, updates);

    if (response.success) {
      toast.success('Quiz details updated successfully');
      setEditDetailsModalOpen(false);
    } else {
      toast.error(response.error || 'Failed to update quiz');
    }
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

  // === MANUAL QUESTION FUNCTIONS ===

  const handleStartManualAdd = () => {
    setAddQuestionsModalOpen(true);
  };

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
    setAddMode('manual');
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

  const handleSubmitManualQuestion = async () => {
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
      setAddMode(null);
      setEditingQuestion(null);
    } else {
      toast.error(response.error || 'Failed to save question');
    }
  };

  // === AI GENERATION FUNCTIONS ===

  const handleStartAIGeneration = () => {
    setAIFormData({
      source_type: 'text',
      text_content: '',
      file_id: '',
      num_questions: '5',
      difficulty: currentQuiz?.difficulty || 'medium',
      question_type: 'multiple_choice',
    });
    setAddMode('ai');
  };

  const handleAIGenerate = async () => {
    // TODO: Implement AI generation API call
    toast.info('AI generation feature coming soon!');
    setAddMode(null);
  };

  // === DELETE FUNCTIONS ===

  const handleDeleteQuestion = (question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;

    const response = await deleteQuestion(questionToDelete.id);

    if (response.success) {
      toast.success('Question deleted successfully');
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } else {
      toast.error(response.error || 'Failed to delete question');
    }
  };

  if (isLoading || !currentQuiz) {
    return <LoadingScreen message="Loading quiz..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Quiz Info Header */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#2D3436',
                    }}
                  >
                    {currentQuiz.title}
                  </Typography>
                  <IconButton
                    onClick={() => setEditDetailsModalOpen(true)}
                    sx={{
                      color: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                {currentQuiz.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#636E72',
                      mb: 3,
                    }}
                  >
                    {currentQuiz.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={currentQuiz.category}
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={DIFFICULTY_LABELS[currentQuiz.difficulty]}
                    sx={{
                      backgroundColor: `${getDifficultyColor(currentQuiz.difficulty)}20`,
                      color: getDifficultyColor(currentQuiz.difficulty),
                      fontWeight: 600,
                    }}
                  />
                  {currentQuiz.is_published && (
                    <Chip
                      label="Published"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <Chip
                    label={`${currentQuiz.questions?.length || 0} Questions`}
                    variant="outlined"
                  />
                  {currentQuiz.time_limit_minutes && (
                    <Chip
                      label={`${currentQuiz.time_limit_minutes} min`}
                      variant="outlined"
                    />
                  )}
                  {currentQuiz.passing_score && (
                    <Chip
                      label={`${currentQuiz.passing_score}% to pass`}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>

              <QuizCraftButton
                variant="outlined"
                onClick={() => navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id }))}
                sx={{
                  borderColor: '#DFE6E9',
                  color: '#636E72',
                }}
              >
                Preview Quiz
              </QuizCraftButton>
            </Box>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#2D3436' }}>
              Quiz Questions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Add questions manually or generate them using AI
            </Typography>

            {/* Add Question Options */}
            {!addMode && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Manual Entry Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: '2px solid #E8E8E8',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={handleStartManualAdd}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        <ManualIcon sx={{ fontSize: 32, color: '#667eea' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Add Questions Manually
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create questions one by one with full control over content and answers
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* AI Generation Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: '2px solid #E8E8E8',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#764ba2',
                        boxShadow: '0 4px 12px rgba(118, 75, 162, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={handleStartAIGeneration}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        <AIIcon sx={{ fontSize: 32, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Generate with AI
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Automatically create questions from text, documents, or images using AI
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}


            {/* AI Generation Form - Coming Soon */}
            {addMode === 'ai' && (
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  border: '2px solid #764ba2',
                  backgroundColor: '#FAFBFC',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <AIIcon sx={{ fontSize: 64, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    AI Question Generation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Generate questions automatically from text, documents, or images using AI.
                    This feature is coming soon!
                  </Typography>
                  <QuizCraftButton
                    variant="outlined"
                    onClick={() => setAddMode(null)}
                  >
                    Close
                  </QuizCraftButton>
                </CardContent>
              </Card>
            )}

            {/* Existing Questions List */}
            {!addMode && currentQuiz.questions && currentQuiz.questions.length > 0 && (
              <Box>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Existing Questions ({currentQuiz.questions.length})
                </Typography>
                <Stack spacing={3}>
                  {currentQuiz.questions.map((question, index) => (
                    <Box key={question.id}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: COLORS.TEXT_SECONDARY }}>
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
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Delete Question Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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

      {/* Edit Quiz Details Modal */}
      <EditQuizDetailsModal
        open={editDetailsModalOpen}
        onClose={() => setEditDetailsModalOpen(false)}
        quiz={currentQuiz}
        onSave={handleSaveQuizDetails}
        isLoading={isLoading}
      />

      {/* Add Questions Modal */}
      <AddQuestionsModal
        open={addQuestionsModalOpen}
        onClose={() => setAddQuestionsModalOpen(false)}
        questions={currentQuiz?.questions || []}
        onAddQuestion={addQuestion}
        onBulkAddQuestions={bulkAddQuestions}
        quizId={id}
      />
    </Box>
  );
}

export default EditQuizScreen;
