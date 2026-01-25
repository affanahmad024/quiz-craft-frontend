// Add AI Questions Modal Component
// Modal for adding AI-generated questions to existing quiz
// Following Phoenix pattern

import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
  Description as DocumentIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import QuizCraftButton from '../buttons/QuizCraftButton';
import AddQuestionsFromTextModal from '../ai/AddQuestionsFromTextModal';
import AddQuestionsFromFileModal from '../ai/AddQuestionsFromFileModal';
import AddQuestionsFromImageModal from '../ai/AddQuestionsFromImageModal';

/**
 * AddAIQuestionsModal Component
 * Landing modal for choosing how to add AI questions to existing quiz
 */
function AddAIQuestionsModal({ open, onClose, quizId, quizTitle }) {
  // Modal states
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Feature cards configuration
  const features = [
    {
      type: 'text',
      icon: AutoAwesomeIcon,
      title: 'Generate from Text',
      description: 'Paste study notes or content to generate questions',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => {
        setTextModalOpen(true);
      },
    },
    {
      type: 'file',
      icon: DocumentIcon,
      title: 'Generate from Documents',
      description: 'Upload PDF, DOCX, or TXT files to generate questions',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => {
        setFileModalOpen(true);
      },
    },
    {
      type: 'image',
      icon: CameraIcon,
      title: 'Extract from Images',
      description: 'Upload quiz images or PDFs to extract questions',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => {
        setImageModalOpen(true);
      },
    },
  ];

  // Handle close - close all modals
  const handleClose = () => {
    setTextModalOpen(false);
    setFileModalOpen(false);
    setImageModalOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
            pt: 3,
            px: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Add AI-Generated Questions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Questions will be added to: <strong>{quizTitle}</strong>
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 3 }}>
          <Grid container spacing={3}>
            {features.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <Grid item xs={12} key={feature.type}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: alpha(feature.color, 0.2),
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: feature.color,
                        boxShadow: `0 8px 24px ${alpha(feature.color, 0.25)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={feature.onClick}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 2,
                            background: feature.gradient,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FeatureIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: feature.color }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 3, pb: 2 }}>
                      <QuizCraftButton
                        variant="contained"
                        fullWidth
                        sx={{
                          background: feature.gradient,
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            opacity: 0.9,
                          },
                        }}
                        onClick={feature.onClick}
                      >
                        Select
                      </QuizCraftButton>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha('#667eea', 0.05),
              border: '1px solid',
              borderColor: alpha('#667eea', 0.2),
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> New questions will be added to your existing quiz. You'll be notified once
              the AI generation is complete.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Sub-modals */}
      <AddQuestionsFromTextModal
        open={textModalOpen}
        onClose={() => {
          setTextModalOpen(false);
          handleClose();
        }}
        quizId={quizId}
        quizTitle={quizTitle}
      />

      <AddQuestionsFromFileModal
        open={fileModalOpen}
        onClose={() => {
          setFileModalOpen(false);
          handleClose();
        }}
        quizId={quizId}
        quizTitle={quizTitle}
      />

      <AddQuestionsFromImageModal
        open={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          handleClose();
        }}
        quizId={quizId}
        quizTitle={quizTitle}
      />
    </>
  );
}

AddAIQuestionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quizId: PropTypes.string.isRequired,
  quizTitle: PropTypes.string.isRequired,
};

export default AddAIQuestionsModal;
