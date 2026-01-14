// Quiz List Screen
// Displays all user's quizzes with filters and actions
// Following Phoenix pattern

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Quiz as QuizIcon } from '@mui/icons-material';
import { useQuiz } from '../../contexts/quiz/QuizContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCard from '../../components/quiz/QuizCard';
import QuizFilters from '../../components/quiz/QuizFilters';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EmptyState from '../../components/screens/EmptyState';
import { toast } from 'react-hot-toast';

function QuizListScreen() {
  const navigate = useNavigate();
  const { quizzes, isLoading, listMyQuizzes, deleteQuiz } = useQuiz();

  console.log('QuizListScreen - quizzes:', quizzes);
  console.log('QuizListScreen - isLoading:', isLoading);

  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    category: '',
    sortBy: 'newest',
    status: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Fetch quizzes on mount
  useEffect(() => {
    console.log('useEffect running - calling listMyQuizzes');
    const fetchQuizzes = async () => {
      const response = await listMyQuizzes();
      console.log('listMyQuizzes response in screen:', response);
      if (!response.success) {
        toast.error(response.error || 'Failed to load quizzes');
      }
    };
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever quizzes or filters change - using useMemo instead of useEffect
  const filteredQuizzes = useMemo(() => {
    // Ensure quizzes is an array before spreading
    if (!Array.isArray(quizzes)) {
      console.error('quizzes is not an array:', quizzes);
      return [];
    }

    let result = [...quizzes];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchLower) ||
          quiz.description?.toLowerCase().includes(searchLower) ||
          quiz.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter((quiz) => quiz.difficulty === filters.difficulty);
    }

    // Category filter
    if (filters.category) {
      result = result.filter((quiz) => quiz.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      const isPublished = filters.status === 'published';
      result = result.filter((quiz) => quiz.is_published === isPublished);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popular':
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [quizzes, filters]);

  // Handle search
  const handleSearch = (searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Handle view quiz
  const handleViewQuiz = (quiz) => {
    navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: quiz.id }));
  };

  // Handle edit quiz
  const handleEditQuiz = (quiz) => {
    navigate(buildRoute(ROUTES.QUIZ_EDIT, { id: quiz.id }));
  };

  // Handle delete quiz - show confirmation
  const handleDeleteQuiz = (quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!quizToDelete) return;

    const response = await deleteQuiz(quizToDelete.id);

    if (response.success) {
      toast.success('Quiz deleted successfully');
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } else {
      toast.error(response.error || 'Failed to delete quiz');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  // Handle create new quiz
  const handleCreateQuiz = () => {
    navigate(ROUTES.QUIZ_CREATE);
  };

  if (isLoading && quizzes.length === 0) {
    return <LoadingScreen message="Loading your quizzes..." />;
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
              }}
            >
              My Quizzes
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Create, manage, and share your quizzes
            </Typography>
          </Box>

          <QuizCraftButton
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateQuiz}
            sx={{
              bgcolor: 'white',
              color: '#6C5CE7',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Create New Quiz
          </QuizCraftButton>
        </Box>

        {/* Filters */}
        <QuizFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

        {/* Quiz Grid or Empty State */}
        {filteredQuizzes.length === 0 ? (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
            }}
          >
            <EmptyState
              icon={QuizIcon}
              title={quizzes.length === 0 ? 'No Quizzes Yet' : 'No Quizzes Match Your Filters'}
              description={
                quizzes.length === 0
                  ? 'Get started by creating your first quiz!'
                  : 'Try adjusting your filters to see more results.'
              }
              action={
                quizzes.length === 0 ? (
                  <QuizCraftButton
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={handleCreateQuiz}
                    sx={{
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    }}
                  >
                    Create Your First Quiz
                  </QuizCraftButton>
                ) : null
              }
            />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <QuizCard
                  quiz={quiz}
                  onView={handleViewQuiz}
                  onEdit={handleEditQuiz}
                  onDelete={handleDeleteQuiz}
                />
              </Grid>
            ))}
          </Grid>
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
            Are you sure you want to delete &quot;{quizToDelete?.title}&quot;?
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
    </Box>
  );
}

export default QuizListScreen;
