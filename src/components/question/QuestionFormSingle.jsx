import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import QuizCraftButton from '../buttons/QuizCraftButton';
import QuestionFormFields from './QuestionFormFields';
import {
  QUESTION_TYPE_LABELS,
  QUIZ_VALIDATION,
  MIN_ANSWERS_REQUIRED,
} from '../../constants/QuizConstants';

function QuestionFormSingle({
  open,
  onClose,
  onSubmit,
  questionType,
  initialData,
  isLoading,
  sections,
  defaultSectionId,
  onCreateSection,
}) {
  const getDefaultAnswers = (type) => {
    if (type === 'true_false') {
      return [
        { answer_text: 'True', is_correct: false, order_index: 0 },
        { answer_text: 'False', is_correct: false, order_index: 1 },
      ];
    }
    if (type === 'multiple_choice') {
      return [
        { answer_text: '', is_correct: false, order_index: 0 },
        { answer_text: '', is_correct: false, order_index: 1 },
      ];
    }
    return [];
  };

  const [formData, setFormData] = useState({
    section_id: defaultSectionId || '',
    question_text: '',
    points: 1,
    explanation: '',
    image_file: null,
    answers: getDefaultAnswers(questionType),
  });
  const [errors, setErrors] = useState({});
  const [newSectionTitle, setNewSectionTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        section_id: initialData.section_id || defaultSectionId || '',
        question_text: initialData.question_text || '',
        points: initialData.points || 1,
        explanation: initialData.explanation || '',
        image_file: initialData.meta?.image_url || null,
        answers: initialData.answers || getDefaultAnswers(questionType),
      });
    } else {
      setFormData({
        section_id: defaultSectionId || '',
        question_text: '',
        points: 1,
        explanation: '',
        image_file: null,
        answers: getDefaultAnswers(questionType),
      });
    }
  }, [initialData, questionType, open, defaultSectionId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question_text.trim()) {
      newErrors.question_text = 'Question text is required';
    } else if (formData.question_text.length > QUIZ_VALIDATION.QUESTION_TEXT_MAX_LENGTH) {
      newErrors.question_text = `Question text must not exceed ${QUIZ_VALIDATION.QUESTION_TEXT_MAX_LENGTH} characters`;
    }

    const points = parseInt(formData.points);
    if (Number.isNaN(points)) {
      newErrors.points = 'Points must be a number';
    } else if (points < QUIZ_VALIDATION.MIN_POINTS || points > QUIZ_VALIDATION.MAX_POINTS) {
      newErrors.points = `Points must be between ${QUIZ_VALIDATION.MIN_POINTS} and ${QUIZ_VALIDATION.MAX_POINTS}`;
    }

    if (formData.explanation && formData.explanation.length > QUIZ_VALIDATION.EXPLANATION_MAX_LENGTH) {
      newErrors.explanation = `Explanation must not exceed ${QUIZ_VALIDATION.EXPLANATION_MAX_LENGTH} characters`;
    }

    if (questionType !== 'short_answer') {
      const answerErrors = [];
      let hasCorrectAnswer = false;

      formData.answers.forEach((answer, index) => {
        if (!answer.answer_text.trim()) {
          answerErrors[index] = 'Answer text is required';
        } else if (answer.answer_text.length > QUIZ_VALIDATION.ANSWER_TEXT_MAX_LENGTH) {
          answerErrors[index] = `Answer must not exceed ${QUIZ_VALIDATION.ANSWER_TEXT_MAX_LENGTH} characters`;
        }
        if (answer.is_correct) hasCorrectAnswer = true;
      });

      if (answerErrors.length > 0) newErrors.answers = answerErrors;
      if (!hasCorrectAnswer) newErrors.answers = 'At least one answer must be marked as correct';
      if (formData.answers.length < MIN_ANSWERS_REQUIRED[questionType]) {
        newErrors.answers = `At least ${MIN_ANSWERS_REQUIRED[questionType]} answers are required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      section_id: formData.section_id || defaultSectionId || undefined,
      question_text: formData.question_text.trim(),
      question_type: questionType,
      points: parseInt(formData.points),
      explanation: formData.explanation.trim() || null,
      image_file: formData.image_file instanceof File ? formData.image_file : null,
      answers:
        questionType !== 'short_answer'
          ? formData.answers.map((answer, index) => ({
              answer_text: answer.answer_text.trim(),
              is_correct: answer.is_correct,
              order_index: index,
            }))
          : [],
    });
  };

  const handleCreateSection = async () => {
    const title = newSectionTitle.trim();
    if (!title || !onCreateSection) return;
    const response = await onCreateSection(title);
    const section = response?.data?.data || response?.data || response;
    if (response?.success && section?.id) {
      setFormData((prev) => ({ ...prev, section_id: section.id }));
      setNewSectionTitle('');
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 2, pt: 3, px: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {initialData ? 'Edit' : 'Add'} {QUESTION_TYPE_LABELS[questionType]} Question
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the question details below
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={isLoading} sx={{ color: 'text.secondary', '&:hover': { backgroundColor: alpha('#000', 0.05) } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3, backgroundColor: '#F8F9FA' }}>
        <Box sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E8E8E8' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="question-section-label">Section</InputLabel>
              <Select
                labelId="question-section-label"
                label="Section"
                value={formData.section_id || defaultSectionId || ''}
                onChange={(event) => setFormData((prev) => ({ ...prev, section_id: event.target.value }))}
              >
                {(sections || []).map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="New section"
              value={newSectionTitle}
              onChange={(event) => setNewSectionTitle(event.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 220 } }}
            />
            <QuizCraftButton variant="outlined" onClick={handleCreateSection} disabled={!newSectionTitle.trim() || isLoading} sx={{ minWidth: 96 }}>
              Create
            </QuizCraftButton>
          </Stack>

          <QuestionFormFields data={formData} questionType={questionType} onChange={setFormData} errors={errors} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid', borderColor: 'divider', backgroundColor: '#FAFBFC' }}>
        <QuizCraftButton variant="outlined" onClick={handleClose} disabled={isLoading} sx={{ borderColor: '#DFE6E9', color: '#636E72', '&:hover': { borderColor: '#B2BEC3', backgroundColor: alpha('#636E72', 0.05) } }}>
          Cancel
        </QuizCraftButton>
        <QuizCraftButton variant="contained" onClick={handleSubmit} loading={isLoading} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 600, px: 3, '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)' } }}>
          {initialData ? 'Save Changes' : 'Add Question'}
        </QuizCraftButton>
      </DialogActions>
    </Dialog>
  );
}

QuestionFormSingle.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  questionType: PropTypes.oneOf(['multiple_choice', 'true_false', 'short_answer']).isRequired,
  initialData: PropTypes.object,
  isLoading: PropTypes.bool,
  sections: PropTypes.array,
  defaultSectionId: PropTypes.string,
  onCreateSection: PropTypes.func,
};

QuestionFormSingle.defaultProps = {
  initialData: null,
  isLoading: false,
  sections: [],
  defaultSectionId: '',
  onCreateSection: null,
};

export default QuestionFormSingle;
