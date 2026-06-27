// Quiz Detail Screen
// View quiz details and questions
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
  Chip,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  QuestionAnswer as QuestionAnswerIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import useNetReq from '../../hooks/NetworkRequest';
import { listMyAttempts } from '../../services/attempt/AttemptServices';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../constants/QuizConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import QuestionCard from '../../components/quiz/QuestionCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

function QuizDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, isLoading, getQuiz, deleteQuiz, publishQuiz, unpublishQuiz } = useQuiz();
  const { user } = useAuth();
  const { fetchData } = useNetReq();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [showQuestionsDialogOpen, setShowQuestionsDialogOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);

  // Fetch quiz and attempts on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getQuiz(id, true);
      if (!response.success) {
        toast.error(response.error || 'Failed to load quiz');
        navigate(ROUTES.QUIZ_LIST);
      }
    };
    fetchQuiz();

    // Fetch attempts for this quiz
    const fetchAttempts = async () => {
      setAttemptsLoading(true);
      const abortRef = { current: null };
      const response = await listMyAttempts(fetchData, abortRef, { quizId: id });
      setAttemptsLoading(false);

      if (response.success && response.data?.data?.attempts) {
        setAttempts(response.data.data.attempts);
      }
    };
    fetchAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check if user is creator
  const isCreator = currentQuiz && user && currentQuiz.creator_id === user.id;

  // Handle start quiz
  const handleStartQuiz = () => {
    navigate(buildRoute(ROUTES.QUIZ_START, { id }));
  };

  // Handle edit quiz
  const handleEditQuiz = () => {
    navigate(buildRoute(ROUTES.QUIZ_EDIT, { id }));
  };

  // Handle delete quiz - show confirmation
  const handleDeleteQuiz = () => {
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    const response = await deleteQuiz(id);

    if (response.success) {
      toast.success('Quiz deleted successfully');
      navigate(ROUTES.QUIZ_LIST);
    } else {
      toast.error(response.error || 'Failed to delete quiz');
      setDeleteDialogOpen(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Handle publish/unpublish
  const handleTogglePublish = () => {
    setPublishDialogOpen(true);
  };

  // Confirm publish/unpublish
  const confirmTogglePublish = async () => {
    const response = currentQuiz.is_published
      ? await unpublishQuiz(id)
      : await publishQuiz(id);

    if (response.success) {
      toast.success(
        currentQuiz.is_published
          ? 'Quiz unpublished successfully'
          : 'Your quiz will be published after AI enrichment. You will be notified.'
      );
      setPublishDialogOpen(false);

      // Refresh quiz data to show updated information
      await getQuiz(id, true);
    } else {
      toast.error(response.error || 'Failed to update quiz status');
      setPublishDialogOpen(false);
    }
  };

  // Cancel publish/unpublish
  const cancelTogglePublish = () => {
    setPublishDialogOpen(false);
  };

  // Handle show questions button click
  const handleShowQuestionsClick = () => {
    setShowQuestionsDialogOpen(true);
  };

  // Confirm show questions
  const confirmShowQuestions = () => {
    setShowQuestionsDialogOpen(false);
    setQuestionsModalOpen(true);
  };

  // Cancel show questions
  const cancelShowQuestions = () => {
    setShowQuestionsDialogOpen(false);
  };

  // Close questions modal
  const handleCloseQuestionsModal = () => {
    setQuestionsModalOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (isLoading || !currentQuiz) {
    return <LoadingScreen message="Loading quiz details..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Title and Status */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: COLORS.TEXT_PRIMARY,
                    mb: 1,
                  }}
                >
                  {currentQuiz.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={currentQuiz.is_published ? 'Published' : currentQuiz.publish_status === 'enrichment_pending' || currentQuiz.publish_status === 'enrichment_processing' ? 'Publishing' : currentQuiz.publish_status === 'enrichment_failed' ? 'Publish Failed' : 'Draft'}
                    sx={{
                      bgcolor: currentQuiz.is_published
                        ? COLORS.PUBLISHED
                        : COLORS.DRAFT,
                      color: COLORS.WHITE,
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={currentQuiz.category}
                    variant="outlined"
                    sx={{
                      borderColor: COLORS.PRIMARY,
                      color: COLORS.PRIMARY,
                    }}
                  />
                  <Chip
                    label={DIFFICULTY_LABELS[currentQuiz.difficulty]}
                    color={DIFFICULTY_COLORS[currentQuiz.difficulty]}
                  />
                </Box>
              </Box>

              {/* Action Buttons for Creator */}
              {isCreator && (
                <Stack direction="row" spacing={1}>
                  <QuizCraftButton
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={handleEditQuiz}
                  >
                    Edit
                  </QuizCraftButton>
                  <QuizCraftButton
                    variant="outlined"
                    size="small"
                    color={currentQuiz.is_published ? 'warning' : 'success'}
                    startIcon={
                      currentQuiz.is_published ? (
                        <UnpublishedIcon />
                      ) : (
                        <PublishIcon />
                      )
                    }
                    onClick={handleTogglePublish}
                  >
                    {currentQuiz.is_published ? 'Unpublish' : 'Publish'}
                  </QuizCraftButton>
                  <QuizCraftButton
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteQuiz}
                  >
                    Delete
                  </QuizCraftButton>
                </Stack>
              )}
            </Box>

            {/* Description */}
            {currentQuiz.description && (
              <Typography
                variant="body1"
                sx={{
                  color: COLORS.TEXT_SECONDARY,
                  mb: 3,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {currentQuiz.description}
              </Typography>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Stats Grid */}
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuestionAnswerIcon sx={{ color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {currentQuiz.question_count || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Questions
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {currentQuiz.time_limit_minutes && (
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: COLORS.INFO }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {currentQuiz.time_limit_minutes}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Minutes
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {currentQuiz.passing_score && (
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: COLORS.WARNING }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {currentQuiz.passing_score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Passing Score
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon sx={{ color: COLORS.SUCCESS }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {currentQuiz.view_count || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Views
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Tags */}
            {currentQuiz.tags && currentQuiz.tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: COLORS.TEXT_SECONDARY }}
                >
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {currentQuiz.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: COLORS.LIGHTER_GRAY,
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Start Quiz Button */}
            {currentQuiz.is_published && (
              <Box sx={{ mt: 3 }}>
                <QuizCraftButton
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartQuiz}
                  sx={{
                    background:
                      'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #5F3DC4 0%, #6C5CE7 100%)',
                    },
                  }}
                >
                  Start Quiz
                </QuizCraftButton>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* My Attempts Section */}
        {attempts.length > 0 && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#2D3436',
                  mb: 3,
                }}
              >
                My Attempts ({attempts.length})
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Percentage</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attempts.map((attempt) => (
                      <TableRow
                        key={attempt.id}
                        sx={{
                          '&:hover': { bgcolor: '#F8F9FA' },
                        }}
                      >
                        <TableCell>
                          {formatDate(attempt.submitted_at || attempt.started_at)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={attempt.status}
                            size="small"
                            sx={{
                              bgcolor:
                                attempt.status === 'submitted'
                                  ? 'rgba(102, 126, 234, 0.1)'
                                  : 'rgba(158, 158, 158, 0.1)',
                              color:
                                attempt.status === 'submitted' ? '#667eea' : '#636E72',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {attempt.score !== null && attempt.score !== undefined
                            ? `${attempt.score} pts`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {attempt.percentage !== null && attempt.percentage !== undefined
                            ? `${attempt.percentage.toFixed(1)}%`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {attempt.passed !== null && attempt.passed !== undefined ? (
                            <Chip
                              label={attempt.passed ? 'Passed' : 'Failed'}
                              size="small"
                              sx={{
                                bgcolor: attempt.passed
                                  ? 'rgba(67, 233, 123, 0.1)'
                                  : 'rgba(245, 87, 108, 0.1)',
                                color: attempt.passed ? '#43e97b' : '#f5576c',
                                fontWeight: 600,
                              }}
                            />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Show Questions Button */}
        {currentQuiz.questions && currentQuiz.questions.length > 0 && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <QuizCraftButton
              variant="contained"
              size="large"
              startIcon={<QuestionAnswerIcon />}
              onClick={handleShowQuestionsClick}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                },
              }}
            >
              Show Questions ({currentQuiz.questions.length})
            </QuizCraftButton>
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{currentQuiz?.title}&quot;?
            This action cannot be undone. All questions and quiz data will be
            permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            onClick={cancelDelete}
            variant="outlined"
            color="primary"
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            onClick={confirmDelete}
            variant="contained"
            color="error"
            loading={isLoading}
          >
            Delete Quiz
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Publish/Unpublish Confirmation Dialog */}
      <Dialog
        open={publishDialogOpen}
        onClose={cancelTogglePublish}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentQuiz?.is_published ? 'Unpublish Quiz?' : 'Publish Quiz?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentQuiz?.is_published
              ? 'Are you sure you want to unpublish this quiz? It will no longer be accessible to users.'
              : 'AI will enrich missing metadata first. Your quiz will auto-publish after processing, and you will be notified.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            onClick={cancelTogglePublish}
            variant="outlined"
            color="primary"
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            onClick={confirmTogglePublish}
            variant="contained"
            color={currentQuiz?.is_published ? 'warning' : 'success'}
            loading={isLoading}
          >
            {currentQuiz?.is_published ? 'Unpublish' : 'Publish'}
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Show Questions Confirmation Dialog */}
      <Dialog
        open={showQuestionsDialogOpen}
        onClose={cancelShowQuestions}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Show Questions?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to view the questions? This will reveal all quiz questions.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            onClick={cancelShowQuestions}
            variant="outlined"
            color="primary"
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            onClick={confirmShowQuestions}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Yes, Show Questions
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Questions Modal */}
      <Dialog
        open={questionsModalOpen}
        onClose={handleCloseQuestionsModal}
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Quiz Questions ({currentQuiz?.questions?.length || 0})
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {currentQuiz?.questions && currentQuiz.questions.length > 0 ? (
            <Stack spacing={3}>
              {currentQuiz.questions.map((question, index) => (
                <Box key={question.id}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      color: COLORS.TEXT_SECONDARY,
                      fontWeight: 600,
                    }}
                  >
                    Question {index + 1}
                  </Typography>
                  <Card
                    sx={{
                      borderRadius: 2,
                      border: '1px solid #E8E8E8',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {question.question_text}
                      </Typography>

                      {question.explanation && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            color: COLORS.TEXT_SECONDARY,
                            fontStyle: 'italic',
                          }}
                        >
                          Explanation: {question.explanation}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 1.5,
                          color: COLORS.TEXT_SECONDARY,
                          fontWeight: 600,
                        }}
                      >
                        Answer Options:
                      </Typography>

                      {question.answers && question.answers.length > 0 ? (
                        <Stack spacing={1}>
                          {question.answers.map((answer, answerIndex) => (
                            <Box
                              key={answer.id}
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                border: '1px solid #E8E8E8',
                                backgroundColor: '#F8F9FA',
                              }}
                            >
                              <Typography variant="body2">
                                {String.fromCharCode(65 + answerIndex)}. {answer.answer_text}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No answers available
                        </Typography>
                      )}

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip
                          label={`${question.points || 1} point${question.points !== 1 ? 's' : ''}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                          }}
                        />
                        <Chip
                          label={question.question_type}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <QuestionAnswerIcon
                sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No Questions Available
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <QuizCraftButton
            onClick={handleCloseQuestionsModal}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Close
          </QuizCraftButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuizDetailScreen;

