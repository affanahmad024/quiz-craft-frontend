// Discover Screen
// Browse and discover public quizzes
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useDiscovery } from '../../contexts/discovery/DiscoveryContextProvider';
import { ROUTES, buildRoute } from '../../constants/RouteConstants';
import QuizCard from '../../components/quiz/QuizCard';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { toast } from 'react-hot-toast';

/**
 * Discover Screen
 * Browse and discover public quizzes
 */
function DiscoverScreen() {
  const navigate = useNavigate();
  const { searchResults, searchMeta, isLoading, searchQuizzes } = useDiscovery();

  const [filters, setFilters] = useState({
    query: '',
    category: '',
    difficulty: '',
    sortBy: 'popular',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initial load
  useEffect(() => {
    handleSearch();
    setInitialLoad(false);
  }, []);

  // Page change
  useEffect(() => {
    if (!initialLoad) {
      handleSearch();
    }
  }, [currentPage]);

  // Filter change
  useEffect(() => {
    if (!initialLoad) {
      setCurrentPage(1);
      handleSearch();
    }
  }, [filters.category, filters.difficulty, filters.sortBy]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch();
  };

  const handleViewQuiz = (quiz) => {
    navigate(buildRoute(ROUTES.QUIZ_DETAIL, { id: quiz.id }));
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (initialLoad && isLoading) {
    return <LoadingScreen message="Loading quizzes..." />;
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#2D3436',
              mb: 1,
            }}
          >
            Discover Quizzes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#636E72',
            }}
          >
            Explore thousands of quizzes created by the community
          </Typography>
        </Box>

        {/* Search and Filters Card */}
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <Grid container spacing={2} alignItems="center">
              {/* Search Bar */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search quizzes..."
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#636E72' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel shrink>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    displayEmpty
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, category: e.target.value }))
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '& .MuiInputLabel-root': {
                        backgroundColor: '#FFFFFF',
                        padding: '0 4px',
                      },
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="Programming">Programming</MenuItem>
                    <MenuItem value="Mathematics">Mathematics</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="History">History</MenuItem>
                    <MenuItem value="Geography">Geography</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Difficulty Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel shrink>Difficulty</InputLabel>
                  <Select
                    value={filters.difficulty}
                    label="Difficulty"
                    displayEmpty
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '& .MuiInputLabel-root': {
                        backgroundColor: '#FFFFFF',
                        padding: '0 4px',
                      },
                    }}
                  >
                    <MenuItem value="">All Levels</MenuItem>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel shrink>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    displayEmpty
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '& .MuiInputLabel-root': {
                        backgroundColor: '#FFFFFF',
                        padding: '0 4px',
                      },
                    }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="popular">Popular</MenuItem>
                    <MenuItem value="most_attempted">Most Attempted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>

          {/* Active Filters */}
          {(filters.query || filters.category || filters.difficulty) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filters.query && (
                <Chip
                  label={`Search: "${filters.query}"`}
                  onDelete={() => setFilters((prev) => ({ ...prev, query: '' }))}
                  sx={{ backgroundColor: '#E8E8E8' }}
                />
              )}
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => setFilters((prev) => ({ ...prev, category: '' }))}
                  sx={{ backgroundColor: '#E8E8E8' }}
                />
              )}
              {filters.difficulty && (
                <Chip
                  label={`Difficulty: ${filters.difficulty}`}
                  onDelete={() => setFilters((prev) => ({ ...prev, difficulty: '' }))}
                  sx={{ backgroundColor: '#E8E8E8' }}
                />
              )}
            </Box>
          )}
        </Card>

        {/* Results */}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress
              sx={{
                color: '#667eea',
              }}
            />
          </Box>
        ) : searchResults.length === 0 ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#2D3436',
                fontWeight: 600,
                mb: 1,
              }}
            >
              No Quizzes Found
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#636E72',
              }}
            >
              Try adjusting your filters or search query
            </Typography>
          </Card>
        ) : (
          <>
            {/* Results Count */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#636E72',
                }}
              >
                Showing {searchResults.length} of {searchMeta.total} quizzes
              </Typography>
            </Box>

            {/* Quiz Grid */}
            <Grid container spacing={3}>
              {searchResults.map((quiz) => (
                <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                  <QuizCard
                    quiz={quiz}
                    onView={() => handleViewQuiz(quiz)}
                    showStartButton={false}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {searchMeta.totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Pagination
                  count={searchMeta.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#2D3436',
                      borderColor: '#E8E8E8',
                      '&:hover': {
                        backgroundColor: '#F8F9FA',
                      },
                    },
                    '& .Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important',
                      color: 'white !important',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%) !important',
                      },
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
