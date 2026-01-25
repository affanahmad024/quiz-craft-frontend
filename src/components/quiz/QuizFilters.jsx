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
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E8E8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'visible',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FilterListIcon sx={{ color: '#667eea' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
          Filter & Search
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ alignItems: 'flex-start' }}>
        {/* Search Input */}
        <Grid item xs={12} md={12} lg={12}>
          <QuizCraftTextInput
            placeholder="Search by title, description, or tags..."
            onChange={handleSearchChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#F8F9FA',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                },
                '&.Mui-focused': {
                  backgroundColor: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    borderWidth: '2px',
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#667eea' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Difficulty Filter */}
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <QuizCraftTextInput
            select
            label="Difficulty"
            defaultValue=""
            onChange={handleFilterChange('difficulty')}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: false,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    mt: 0.5,
                  },
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
                borderRadius: 2,
                minHeight: '56px',
              },
              '& .MuiSelect-select': {
                py: 1.5,
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
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
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <QuizCraftTextInput
            select
            label="Category"
            defaultValue=""
            onChange={handleFilterChange('category')}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: false,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    mt: 0.5,
                  },
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
                borderRadius: 2,
                minHeight: '56px',
              },
              '& .MuiSelect-select': {
                py: 1.5,
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
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
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <QuizCraftTextInput
            select
            label="Sort By"
            defaultValue="newest"
            onChange={handleFilterChange('sortBy')}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: false,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    mt: 0.5,
                  },
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
                borderRadius: 2,
                minHeight: '56px',
              },
              '& .MuiSelect-select': {
                py: 1.5,
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
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
        <Grid item xs={6} sm={4} md={3} lg={3}>
          <QuizCraftTextInput
            select
            label="Status"
            defaultValue=""
            onChange={handleFilterChange('status')}
            fullWidth
            SelectProps={{
              MenuProps: {
                disablePortal: false,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    mt: 0.5,
                  },
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F8F9FA',
                borderRadius: 2,
                minHeight: '56px',
              },
              '& .MuiSelect-select': {
                py: 1.5,
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 16px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)',
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
    </Paper>
  );
}

QuizFilters.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default QuizFilters;
