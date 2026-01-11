// Discover Screen
// Browse and discover public quizzes
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Pagination } from '@mui/material';
import { useDiscovery } from '../../contexts/discovery/DiscoveryContextProvider';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCard from '../../components/quiz/QuizCard';
import QuizFilters from '../../components/quiz/QuizFilters';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EmptyState from '../../components/screens/EmptyState';

/**
 * Discover Screen
 * Browse and discover public quizzes
 */
function DiscoverScreen() {
  const navigate = useNavigate();
  const { searchResults, searchMeta, isLoading, searchQuizzes } = useDiscovery();
  const { startAttempt } = useAttempt();

  const [filters, setFilters] = useState({
    query: '',
    category: '',
    difficulty: '',
    sortBy: 'popular',
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const handleSearch = async () => {
    await searchQuizzes({
      query: filters.query,
      category: filters.category,
      difficulty: filters.difficulty,
      sortBy: filters.sortBy,
      page: currentPage,
      limit: 12,
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (searchText) => {
    setFilters((prev) => ({
      ...prev,
      query: searchText,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (filters.query || filters.category || filters.difficulty) {
      handleSearch();
    }
  }, [filters]);

  const handleViewQuiz = (quiz) => {
    navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: quiz.id }));
  };

  const handleStartQuiz = async (quiz) => {
    const response = await startAttempt(quiz.id);
    if (response.success) {
      navigate(buildRoute(ROUTES.QUIZ_START, { id: quiz.id }));
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && searchResults.length === 0) {
    return <LoadingScreen />;
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
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
          }}
        >
          Discover Quizzes
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Explore thousands of quizzes created by the community
        </Typography>

        <Box sx={{ mb: 4 }}>
          <QuizFilters onSearch={handleSearchSubmit} onFilterChange={handleFilterChange} />
        </Box>

        {searchResults.length === 0 ? (
          <EmptyState
            title="No Quizzes Found"
            message="Try adjusting your filters or search query"
          />
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                mb: 2,
              }}
            >
              {searchMeta.total} quizzes found
            </Typography>

            <Grid container spacing={3}>
              {searchResults.map((quiz) => (
                <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                  <QuizCard
                    quiz={quiz}
                    onView={() => handleViewQuiz(quiz)}
                    onStart={() => handleStartQuiz(quiz)}
                    showStartButton={true}
                  />
                </Grid>
              ))}
            </Grid>

            {searchMeta.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={searchMeta.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      borderColor: 'white',
                    },
                    '& .Mui-selected': {
                      bgcolor: 'white !important',
                      color: '#6C5CE7',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default DiscoverScreen;
