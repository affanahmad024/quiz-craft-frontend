// AI Quiz Generation Screen
// Main landing page for AI-powered quiz generation
// Following Phoenix pattern

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  alpha,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Description as DocumentIcon,
  CameraAlt as CameraIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import GenerateFromTextModal from '../../components/ai/GenerateFromTextModal';
import GenerateFromFileModal from '../../components/ai/GenerateFromFileModal';
import ExtractFromFileModal from '../../components/ai/ExtractFromFileModal';
import {
  AI_FEATURE_TYPES,
  AI_FEATURE_LABELS,
  AI_FEATURE_DESCRIPTIONS,
} from '../../constants/AIConstants';

/**
 * AIQuizGenerationScreen Component
 * Landing page for three distinct AI features
 */
function AIQuizGenerationScreen() {
  const navigate = useNavigate();

  // Modal states
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);

  // Feature cards configuration
  const features = [
    {
      type: AI_FEATURE_TYPES.GENERATE_FROM_TEXT,
      icon: AutoAwesomeIcon,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => setTextModalOpen(true),
    },
    {
      type: AI_FEATURE_TYPES.GENERATE_FROM_FILE,
      icon: DocumentIcon,
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      onClick: () => setFileModalOpen(true),
    },
    {
      type: AI_FEATURE_TYPES.EXTRACT_FROM_FILE,
      icon: CameraIcon,
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => setExtractModalOpen(true),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <QuizCraftButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            borderColor: '#DFE6E9',
            color: '#636E72',
            '&:hover': {
              borderColor: '#B2BEC3',
              backgroundColor: alpha('#636E72', 0.05),
            },
          }}
        >
          Back to Dashboard
        </QuizCraftButton>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AI-Powered Quiz Generation
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto' }}
        >
          Choose how you want to create your quiz using AI
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={4}>
        {features.map((feature) => {
          const FeatureIcon = feature.icon;

          return (
            <Grid item xs={12} md={4} key={feature.type}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: alpha(feature.color, 0.2),
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: feature.color,
                    boxShadow: `0 8px 24px ${alpha(feature.color, 0.25)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={feature.onClick}
              >
                {/* Icon Header */}
                <Box
                  sx={{
                    p: 3,
                    background: feature.gradient,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 140,
                  }}
                >
                  <FeatureIcon sx={{ fontSize: 80, color: '#FFFFFF' }} />
                </Box>

                {/* Content */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mb: 2, color: feature.color }}
                  >
                    {AI_FEATURE_LABELS[feature.type]}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {AI_FEATURE_DESCRIPTIONS[feature.type]}
                  </Typography>
                </CardContent>

                {/* Action */}
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <QuizCraftButton
                    variant="contained"
                    fullWidth
                    sx={{
                      background: feature.gradient,
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                    onClick={feature.onClick}
                  >
                    Get Started
                  </QuizCraftButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modals */}
      <GenerateFromTextModal
        open={textModalOpen}
        onClose={() => setTextModalOpen(false)}
      />

      <GenerateFromFileModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
      />

      <ExtractFromFileModal
        open={extractModalOpen}
        onClose={() => setExtractModalOpen(false)}
      />
    </Container>
  );
}

export default AIQuizGenerationScreen;
