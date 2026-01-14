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
} from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

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
  }, [id, getQuiz, navigate]);

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
          : 'Quiz published successfully'
      );
      setPublishDialogOpen(false);
    } else {
      toast.error(response.error || 'Failed to update quiz status');
      setPublishDialogOpen(false);
    }
  };

  // Cancel publish/unpublish
  const cancelTogglePublish = () => {
    setPublishDialogOpen(false);
  };

  if (isLoading || !currentQuiz) {
    return <LoadingScreen message="Loading quiz details..." />;
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
        {/* Header Card */}
        <Card sx={{ mb: 3 }}>
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
                    label={currentQuiz.is_published ? 'Published' : 'Draft'}
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

        {/* Questions Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Questions ({currentQuiz.questions?.length || 0})
          </Typography>
        </Box>

        {/* Questions List */}
        {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
          <Stack spacing={3}>
            {currentQuiz.questions.map((question, index) => (
              <Box key={question.id}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'white',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Question {index + 1}
                </Typography>
                <QuestionCard question={question} editable={false} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <QuestionAnswerIcon
                sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No Questions Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isCreator
                  ? 'This quiz doesn\'t have any questions yet. Click "Edit" to add questions.'
                  : 'This quiz doesn\'t have any questions yet.'}
              </Typography>
            </CardContent>
          </Card>
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
              : 'Are you sure you want to publish this quiz? It will be accessible to users.'}
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
    </Box>
  );
}

export default QuizDetailScreen;
