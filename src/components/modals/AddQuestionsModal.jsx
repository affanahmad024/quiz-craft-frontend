// Add Questions Modal Component
// Full-screen modal for managing questions organized by type
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  Divider,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuestionFormSingle from '../question/QuestionFormSingle';
import QuestionFormBulk from '../question/QuestionFormBulk';
import { QUESTION_TYPE_LABELS } from '../../constants/QuizConstants';
import { toast } from 'react-hot-toast';

/**
 * AddQuestionsModal Component
 * Full-screen modal for adding questions organized by type
 * @param {boolean} open - Whether modal is open
 * @param {function} onClose - Callback to close modal
 * @param {array} questions - Existing questions
 * @param {function} onAddQuestion - Callback to add single question
 * @param {function} onBulkAddQuestions - Callback to bulk add questions
 * @param {function} onUpdateQuestion - Callback to update existing question
 * @param {object} editingQuestion - Question being edited (if any)
 * @param {string} quizId - Quiz ID
 */
function AddQuestionsModal({
  open,
  onClose,
  questions,
  onAddQuestion,
  onBulkAddQuestions,
  onUpdateQuestion,
  editingQuestion,
  quizId,
}) {
  const [singleFormOpen, setSingleFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update form state when editingQuestion changes
  useEffect(() => {
    if (editingQuestion && open) {
      setSelectedType(editingQuestion.question_type);
      setSingleFormOpen(true);
    }
  }, [editingQuestion, open]);

  // Group questions by type
  const questionsByType = {
    multiple_choice: questions.filter((q) => q.question_type === 'multiple_choice'),
    true_false: questions.filter((q) => q.question_type === 'true_false'),
    short_answer: questions.filter((q) => q.question_type === 'short_answer'),
  };

  // Handle opening single form
  const handleOpenSingleForm = (type) => {
    setSelectedType(type);
    setSingleFormOpen(true);
  };

  // Handle opening bulk form
  const handleOpenBulkForm = (type) => {
    setSelectedType(type);
    setBulkFormOpen(true);
  };

  // Handle single question submit
  const handleSingleSubmit = async (questionData) => {
    setIsLoading(true);
    let response;

    if (editingQuestion) {
      // Update existing question
      response = await onUpdateQuestion(editingQuestion.id, questionData);
    } else {
      // Add new question
      response = await onAddQuestion(quizId, questionData);
    }

    setIsLoading(false);

    if (response.success) {
      toast.success(editingQuestion ? 'Question updated successfully' : 'Question added successfully');
      setSingleFormOpen(false);
      onClose(); // Close the modal after saving
    }
  };

  // Handle bulk questions submit
  const handleBulkSubmit = async (questionsData) => {
    setIsLoading(true);
    const response = await onBulkAddQuestions(quizId, questionsData);
    setIsLoading(false);

    if (response.success) {
      toast.success(`${questionsData.length} questions added successfully`);
      setBulkFormOpen(false);
    }
  };

  // Handle close forms
  const handleCloseSingleForm = () => {
    setSingleFormOpen(false);
    setSelectedType(null);
  };

  const handleCloseBulkForm = () => {
    setBulkFormOpen(false);
    setSelectedType(null);
  };

  // Get icon for question type
  const getTypeIcon = (type) => {
    const icons = {
      multiple_choice: CheckBoxIcon,
      true_false: CheckCircleIcon,
      short_answer: EditIcon,
    };
    return icons[type] || CheckBoxIcon;
  };

  // Get color for question type
  const getTypeColor = (type) => {
    const colors = {
      multiple_choice: '#667eea',
      true_false: '#43e97b',
      short_answer: '#fa8231',
    };
    return colors[type] || '#667eea';
  };

  // Render question type section
  const renderTypeSection = (type) => {
    const TypeIcon = getTypeIcon(type);
    const typeColor = getTypeColor(type);
    const typeQuestions = questionsByType[type];

    return (
      <Card
        key={type}
        sx={{
          borderRadius: 3,
          border: '1px solid #E8E8E8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2.5,
            background: `linear-gradient(135deg, ${alpha(typeColor, 0.1)} 0%, ${alpha(typeColor, 0.05)} 100%)`,
            borderBottom: '1px solid #E8E8E8',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: typeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(typeColor, 0.3)}`,
              }}
            >
              <TypeIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3436', mb: 0.5 }}>
                {QUESTION_TYPE_LABELS[type]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {typeQuestions.length} question{typeQuestions.length !== 1 ? 's' : ''} added
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <QuizCraftButton
              variant="contained"
              size="small"
              onClick={() => handleOpenSingleForm(type)}
              sx={{
                backgroundColor: typeColor,
                color: '#FFFFFF',
                fontWeight: 600,
                flex: 1,
                '&:hover': {
                  backgroundColor: typeColor,
                  filter: 'brightness(0.9)',
                },
              }}
            >
              Add Single Question
            </QuizCraftButton>

            <QuizCraftButton
              variant="outlined"
              size="small"
              onClick={() => handleOpenBulkForm(type)}
              sx={{
                borderColor: typeColor,
                color: typeColor,
                fontWeight: 600,
                flex: 1,
                '&:hover': {
                  borderColor: typeColor,
                  backgroundColor: alpha(typeColor, 0.05),
                },
              }}
            >
              Bulk Add 10
            </QuizCraftButton>
          </Stack>
        </Box>

        {typeQuestions.length > 0 && (
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {typeQuestions.map((question, index) => (
                <Box
                  key={question.id}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom:
                      index < typeQuestions.length - 1 ? '1px solid #F0F0F0' : 'none',
                    '&:hover': {
                      backgroundColor: '#F8F9FA',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#2D3436',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {index + 1}. {question.question_text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <>
      {/* Hide type selection dialog when editing */}
      {!singleFormOpen && !bulkFormOpen && (
      <Dialog fullScreen open={open} onClose={onClose}>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: '#FFFFFF',
            color: '#2D3436',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Add Questions Manually
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Organize questions by type and add them individually or in bulk
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  backgroundColor: alpha('#667eea', 0.1),
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                  Total Questions: {questions.length}
                </Typography>
              </Box>

              <QuizCraftButton
                variant="contained"
                onClick={onClose}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                  },
                }}
              >
                Done Adding Questions
              </QuizCraftButton>

              <IconButton edge="end" color="inherit" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            p: 4,
            backgroundColor: '#F8F9FA',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack spacing={3}>
              {/* Multiple Choice Section */}
              {renderTypeSection('multiple_choice')}

              {/* True/False Section */}
              {renderTypeSection('true_false')}

              {/* Short Answer Section */}
              {renderTypeSection('short_answer')}
            </Stack>
          </Box>
        </Box>
      </Dialog>
      )}

      {/* Single Question Form */}
      {singleFormOpen && selectedType && (
        <QuestionFormSingle
          open={singleFormOpen}
          onClose={handleCloseSingleForm}
          onSubmit={handleSingleSubmit}
          questionType={selectedType}
          initialData={editingQuestion}
          isLoading={isLoading}
        />
      )}

      {/* Bulk Question Form */}
      {bulkFormOpen && selectedType && (
        <QuestionFormBulk
          open={bulkFormOpen}
          onClose={handleCloseBulkForm}
          onSubmit={handleBulkSubmit}
          questionType={selectedType}
          count={10}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

AddQuestionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  onBulkAddQuestions: PropTypes.func.isRequired,
  onUpdateQuestion: PropTypes.func,
  editingQuestion: PropTypes.object,
  quizId: PropTypes.string.isRequired,
};

export default AddQuestionsModal;
