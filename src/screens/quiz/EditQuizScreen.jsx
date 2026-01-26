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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import QuestionCard from '../../components/quiz/QuestionCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EditQuizDetailsModal from '../../components/modals/EditQuizDetailsModal';
import AddQuestionsModal from '../../components/modals/AddQuestionsModal';
import AddAIQuestionsModal from '../../components/modals/AddAIQuestionsModal';
import QuestionFormSingle from '../../components/question/QuestionFormSingle';
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
  const [addAIQuestionsModalOpen, setAddAIQuestionsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestionModalOpen, setEditQuestionModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

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

  // Handle add single question with refresh
  const handleAddQuestion = async (quizId, questionData) => {
    const response = await addQuestion(quizId, questionData);

    if (response.success) {
      // Refresh quiz data to show new question
      await getQuiz(id, true);
    }

    return response;
  };

  // Handle bulk add questions with refresh
  const handleBulkAddQuestions = async (quizId, questionsData) => {
    const response = await bulkAddQuestions(quizId, questionsData);

    if (response.success) {
      // Refresh quiz data to show new questions
      await getQuiz(id, true);
    }

    return response;
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setEditQuestionModalOpen(true);
  };

  const handleUpdateQuestion = async (questionData) => {
    if (!editingQuestion) return;

    const response = await updateQuestion(editingQuestion.id, questionData);

    if (response.success) {
      toast.success('Question updated successfully');
      setEditQuestionModalOpen(false);
      setEditingQuestion(null);
      // Refresh quiz data to show updated question
      await getQuiz(id, true);
    }

    return response;
  };

  // === AI GENERATION FUNCTIONS ===

  const handleStartAIGeneration = () => {
    // Open modal to add AI questions to this quiz
    setAddAIQuestionsModalOpen(true);
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
                      whiteSpace: 'pre-line',
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

            {/* Existing Questions List */}
            {currentQuiz.questions && currentQuiz.questions.length > 0 && (
              <Box>
                <Divider sx={{ my: 4 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Existing Questions ({currentQuiz.questions.length})
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      const allExpanded = currentQuiz.questions.every(q => expandedQuestions[q.id]);
                      const newExpanded = {};
                      if (!allExpanded) {
                        currentQuiz.questions.forEach(q => {
                          newExpanded[q.id] = true;
                        });
                      }
                      setExpandedQuestions(newExpanded);
                    }}
                    sx={{ textTransform: 'none', color: COLORS.PRIMARY }}
                  >
                    {currentQuiz.questions.every(q => expandedQuestions[q.id]) ? 'Collapse All' : 'Expand All'}
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {currentQuiz.questions.map((question, index) => (
                    <Accordion
                      key={question.id}
                      expanded={expandedQuestions[question.id] || false}
                      onChange={() => {
                        setExpandedQuestions(prev => ({
                          ...prev,
                          [question.id]: !prev[question.id]
                        }));
                      }}
                      sx={{
                        borderRadius: '12px !important',
                        border: '1px solid #E8E8E8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:before': {
                          display: 'none',
                        },
                        '&.Mui-expanded': {
                          margin: '0 0 16px 0 !important',
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          px: 3,
                          py: 1.5,
                          backgroundColor: '#FAFBFC',
                          borderRadius: '12px',
                          '&.Mui-expanded': {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                          },
                          '& .MuiAccordionSummary-content': {
                            minWidth: 0,
                            overflow: 'hidden',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0, overflow: 'hidden' }}>
                          <Chip
                            label={`Q${index + 1}`}
                            size="small"
                            sx={{
                              backgroundColor: COLORS.PRIMARY,
                              color: '#FFFFFF',
                              fontWeight: 600,
                              minWidth: 45,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: '#2D3436',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                width: '100%',
                                maxWidth: '100%',
                              }}
                            >
                              {question.question_text}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', maxWidth: '100%' }}>
                              <Chip
                                label={QUESTION_TYPE_LABELS[question.question_type]}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  color: COLORS.PRIMARY,
                                }}
                              />
                              <Chip
                                label={`${question.points || 1} pts`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                  color: '#FF9800',
                                }}
                              />
                              {question.meta?.image_url && (
                                <Chip
                                  label="Has Image"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                                    color: '#43e97b',
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Box
                            sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditQuestion(question);
                              }}
                              sx={{
                                color: COLORS.INFO,
                                '&:hover': {
                                  backgroundColor: 'rgba(116, 185, 255, 0.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(question);
                              }}
                              sx={{
                                color: COLORS.ERROR,
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3, backgroundColor: '#FFFFFF' }}>
                        <QuestionCard
                          question={question}
                          editable={false}
                          onEdit={handleEditQuestion}
                          onDelete={handleDeleteQuestion}
                        />
                      </AccordionDetails>
                    </Accordion>
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
            onClick={() => setDeleteDialogOpen(false)}
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
        onClose={() => {
          setAddQuestionsModalOpen(false);
        }}
        questions={currentQuiz?.questions || []}
        onAddQuestion={handleAddQuestion}
        onBulkAddQuestions={handleBulkAddQuestions}
        quizId={id}
      />

      {/* Add AI Questions Modal */}
      <AddAIQuestionsModal
        open={addAIQuestionsModalOpen}
        onClose={() => setAddAIQuestionsModalOpen(false)}
        quizId={id}
        quizTitle={currentQuiz?.title || 'Loading...'}
      />

      {/* Edit Question Modal - Direct form without type selection */}
      {editingQuestion && (
        <QuestionFormSingle
          open={editQuestionModalOpen}
          onClose={() => {
            setEditQuestionModalOpen(false);
            setEditingQuestion(null);
          }}
          onSubmit={handleUpdateQuestion}
          questionType={editingQuestion.question_type}
          initialData={editingQuestion}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}

export default EditQuizScreen;
