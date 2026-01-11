// Answer Option Component
// Single answer option for quiz questions
// Following Phoenix pattern

import PropTypes from 'prop-types';
import { Box, Card, Radio, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { COLORS } from '../../constants/ColorConstants';

/**
 * Answer Option Component
 * Displays a single answer option with selection state
 */
function AnswerOption({ answer, selected, onClick, showCorrect, questionType }) {
  // Determine background color
  let bgcolor = 'white';
  let borderColor = COLORS.DIVIDER;

  if (showCorrect) {
    if (answer.is_correct) {
      bgcolor = 'rgba(0, 184, 148, 0.1)';
      borderColor = COLORS.SUCCESS;
    } else if (selected && !answer.is_correct) {
      bgcolor = 'rgba(255, 107, 107, 0.1)';
      borderColor = COLORS.ERROR;
    }
  } else if (selected) {
    bgcolor = 'rgba(108, 92, 231, 0.1)';
    borderColor = COLORS.PRIMARY;
  }

  return (
    <Card
      onClick={() => !showCorrect && onClick()}
      sx={{
        p: 2,
        bgcolor,
        border: `2px solid ${borderColor}`,
        cursor: showCorrect ? 'default' : 'pointer',
        transition: 'all 0.2s',
        '&:hover': !showCorrect && {
          transform: 'translateX(4px)',
          boxShadow: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Radio
          checked={selected}
          disabled={showCorrect}
          sx={{
            color: borderColor,
            '&.Mui-checked': {
              color: borderColor,
            },
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: selected ? 600 : 400 }}>
            {answer.answer_text}
          </Typography>
        </Box>

        {showCorrect && answer.is_correct && (
          <Chip
            label="Correct Answer"
            size="small"
            icon={<CheckCircleIcon />}
            color="success"
            sx={{ fontWeight: 600 }}
          />
        )}

        {showCorrect && selected && !answer.is_correct && (
          <Chip
            label="Your Answer"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>
    </Card>
  );
}

AnswerOption.propTypes = {
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    answer_text: PropTypes.string.isRequired,
    is_correct: PropTypes.bool,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  showCorrect: PropTypes.bool,
  questionType: PropTypes.oneOf(['multiple_choice', 'true_false', 'short_answer']),
};

AnswerOption.defaultProps = {
  showCorrect: false,
  questionType: 'multiple_choice',
};

export default AnswerOption;
