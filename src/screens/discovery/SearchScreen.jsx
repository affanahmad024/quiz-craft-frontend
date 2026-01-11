// Search Screen
// Search results page
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Pagination } from '@mui/material';
import { useDiscovery } from '../../contexts/discovery/DiscoveryContextProvider';
import { useAttempt } from '../../contexts/attempt/AttemptContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCard from '../../components/quiz/QuizCard';
import QuizFilters from '../../components/quiz/QuizFilters';
import LoadingScreen from '../../components/screens/LoadingScreen';
import EmptyState from '../../components/screens/EmptyState';

/**
 * Search Screen
 * Display search results
 */
function SearchScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { searchResults, searchMeta, isLoading, searchQuizzes } = useDiscovery();
  const { startAttempt } = useAttempt();

  const [filters, setFilters] = useState({
    query: query,
    category: '',
    difficulty: '',
    sortBy: 'newest',
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleSearch();
  }, [query, currentPage]);

  const handleSearch = async () => {
    await searchQuizzes({
      query: filters.query || query,
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
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchText)}`);
  };

  useEffect(() => {
    if (filters.category || filters.difficulty) {
      handleSearch();
    }
  }, [filters.category, filters.difficulty]);

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
          }}
        >
          Search Results
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 1,
          }}
        >
          for: "{query}"
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 4,
          }}
        >
          {searchMeta.total} quizzes found
        </Typography>

        <Box sx={{ mb: 4 }}>
          <QuizFilters onSearch={handleSearchSubmit} onFilterChange={handleFilterChange} />
        </Box>

        {searchResults.length === 0 ? (
          <EmptyState
            title={`No results found for "${query}"`}
            message="Try different keywords or adjust your filters"
          />
        ) : (
          <>
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

export default SearchScreen;
