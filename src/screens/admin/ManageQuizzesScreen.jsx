// Manage Quizzes Screen
// Admin quiz management interface
// Following Phoenix pattern

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  InputAdornment,
  Pagination,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAdmin } from '../../contexts/admin/AdminContextProvider';
import LoadingScreen from '../../components/screens/LoadingScreen';
import { ROUTES } from '../../constants/RouteConstants';
import { formatDate } from '../../utils/FormatUtils';

/**
 * Manage Quizzes Screen
 * Admin interface for quiz management
 */
function ManageQuizzesScreen() {
  const navigate = useNavigate();
  const {
    quizzes,
    quizzesMeta,
    isLoading,
    listQuizzes,
    deleteQuiz,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reasonValue, setReasonValue] = useState('');
  const [permanentDelete, setPermanentDelete] = useState(false);

  useEffect(() => {
    handleListQuizzes(1);
  }, []);

  const handleListQuizzes = (page = 1) => {
    listQuizzes({
      page,
      limit: 10,
      search: searchQuery || undefined,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    handleListQuizzes(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handlePageChange = (event, page) => {
    handleListQuizzes(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuOpen = (event, quiz) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuiz(quiz);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewQuiz = () => {
    if (selectedQuiz) {
      navigate(ROUTES.QUIZ_DETAIL.replace(':id', selectedQuiz.id));
      handleMenuClose();
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setReasonValue('');
    setPermanentDelete(false);
    handleMenuClose();
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedQuiz(null);
    setReasonValue('');
    setPermanentDelete(false);
  };

  const handleDeleteQuiz = async () => {
    if (selectedQuiz) {
      const response = await deleteQuiz(selectedQuiz.id, reasonValue, permanentDelete);
      if (response.success) {
        closeDeleteDialog();
        handleListQuizzes(quizzesMeta.currentPage);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading && quizzes.length === 0) {
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
          Manage Quizzes
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          View and manage all quizzes in the system
        </Typography>

        {/* Search Card */}
        <Card sx={{ mb: 3, p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search quizzes by title or creator..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={handleSearchSubmit}
                    sx={{
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Card>

        {/* Results Count */}
        {quizzesMeta.total > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 2,
              textAlign: 'center',
            }}
          >
            {quizzesMeta.total} quiz{quizzesMeta.total !== 1 ? 'zes' : ''} found
          </Typography>
        )}

        {/* Quizzes Table */}
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Creator</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Published</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : quizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No quizzes found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {quiz.title || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{quiz.creator_name || 'Unknown'}</TableCell>
                      <TableCell>
                        {quiz.category ? (
                          <Chip label={quiz.category} size="small" variant="outlined" />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {quiz.difficulty ? (
                          <Chip
                            label={quiz.difficulty}
                            color={getDifficultyColor(quiz.difficulty)}
                            size="small"
                          />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={quiz.published ? 'Published' : 'Draft'}
                          color={quiz.published ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(quiz.created_at)}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, quiz)} size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {quizzesMeta.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination
                count={quizzesMeta.totalPages}
                page={quizzesMeta.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Card>

        {/* Actions Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleViewQuiz}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View Quiz
          </MenuItem>
          <MenuItem onClick={openDeleteDialog} sx={{ color: 'error.main' }}>
            Delete Quiz
          </MenuItem>
        </Menu>

        {/* Delete Quiz Dialog */}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: 'error.main' }}>Delete Quiz</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
              Are you sure you want to delete <strong>{selectedQuiz?.title}</strong>?
            </Typography>

            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={3}
              value={reasonValue}
              onChange={(e) => setReasonValue(e.target.value)}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={permanentDelete}
                  onChange={(e) => setPermanentDelete(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography variant="body2">
                  Permanent deletion (cannot be recovered)
                </Typography>
              }
            />

            {permanentDelete && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Warning: This action cannot be undone. All quiz data including questions,
                attempts, and results will be permanently deleted.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteQuiz} variant="contained" color="error">
              Delete Quiz
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ManageQuizzesScreen;
