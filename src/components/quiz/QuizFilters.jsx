// QuizFilters Component
// Filter component for quiz list
// Following Phoenix pattern with PropTypes validation

import {
  Box,
  Paper,
  Grid,
  MenuItem,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/ColorConstants';
import {
  QUIZ_CATEGORIES,
  DIFFICULTY_LABELS,
} from '../../constants/QuizConstants';
import QuizCraftTextInput from '../inputs/QuizCraftTextInput';

function QuizFilters({ onSearch, onFilterChange }) {
  // Filter state structure expected: { search, difficulty, category, sortBy }

  const handleSearchChange = (event) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  const handleFilterChange = (filterType) => (event) => {
    if (onFilterChange) {
      onFilterChange(filterType, event.target.value);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.PRIMARY_LIGHT} 100%)`,
        color: COLORS.WHITE,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FilterListIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filter Quizzes
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Search Input */}
        <Grid item xs={12} md={6} lg={3}>
          <QuizCraftTextInput
            placeholder="Search quizzes..."
            onChange={handleSearchChange}
            fullWidth
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: COLORS.WHITE,
                '&:hover': {
                  bgcolor: COLORS.WHITE,
                },
                '&.Mui-focused': {
                  bgcolor: COLORS.WHITE,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.TEXT_SECONDARY }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Difficulty Filter */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <QuizCraftTextInput
            select
            label="Difficulty"
            defaultValue=""
            onChange={handleFilterChange('difficulty')}
            fullWidth
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: COLORS.WHITE,
                '&:hover': {
                  bgcolor: COLORS.WHITE,
                },
                '&.Mui-focused': {
                  bgcolor: COLORS.WHITE,
                },
              },
            }}
          >
            <MenuItem value="">All Levels</MenuItem>
            {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </QuizCraftTextInput>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <QuizCraftTextInput
            select
            label="Category"
            defaultValue=""
            onChange={handleFilterChange('category')}
            fullWidth
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: COLORS.WHITE,
                '&:hover': {
                  bgcolor: COLORS.WHITE,
                },
                '&.Mui-focused': {
                  bgcolor: COLORS.WHITE,
                },
              },
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {QUIZ_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </QuizCraftTextInput>
        </Grid>

        {/* Sort By Filter */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <QuizCraftTextInput
            select
            label="Sort By"
            defaultValue="newest"
            onChange={handleFilterChange('sortBy')}
            fullWidth
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: COLORS.WHITE,
                '&:hover': {
                  bgcolor: COLORS.WHITE,
                },
                '&.Mui-focused': {
                  bgcolor: COLORS.WHITE,
                },
              },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="title_asc">Title (A-Z)</MenuItem>
            <MenuItem value="title_desc">Title (Z-A)</MenuItem>
          </QuizCraftTextInput>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <QuizCraftTextInput
            select
            label="Status"
            defaultValue=""
            onChange={handleFilterChange('status')}
            fullWidth
            size="small"
            sx={{
              bgcolor: COLORS.WHITE,
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: COLORS.WHITE,
                '&:hover': {
                  bgcolor: COLORS.WHITE,
                },
                '&.Mui-focused': {
                  bgcolor: COLORS.WHITE,
                },
              },
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </QuizCraftTextInput>
        </Grid>
      </Grid>

      {/* Filter Info Text */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Use filters to refine your quiz search and find exactly what you're looking for.
        </Typography>
      </Box>
    </Paper>
  );
}

QuizFilters.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default QuizFilters;
