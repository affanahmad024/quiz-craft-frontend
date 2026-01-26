// Landing Page Component
// Production-ready home page for QuizCraft
// Modern, high-conversion design

import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, Stack, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Quiz as QuizIcon,
  Psychology as BrainIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  AutoAwesome as SparkleIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ROUTES } from '../constants/RouteConstants';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import { useThemeMode } from '../contexts/theme/ThemeModeContext';
import InteractiveDemoQuiz from '../components/landing/InteractiveDemoQuiz';
import AnimatedCounter from '../components/landing/AnimatedCounter';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const floatAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useThemeMode();

  // Parallax effect
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => navigate(user ? ROUTES.DASHBOARD : ROUTES.SIGNUP);
  const handleExplore = () => navigate(ROUTES.DISCOVER);

  // Three Pillars - Feature categories for different user types
  const features = [
    {
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      title: 'For Quiz Creators',
      description: 'AI-powered quiz generation from text or files. Create, edit, and share quizzes with multiple question types. Drag-and-drop reordering makes building quizzes effortless.',
      color: '#6C5CE7',
      bg: 'rgba(108, 92, 231, 0.1)',
      highlights: [
        '🤖 AI Quiz Generation',
        '📝 Multiple Question Types',
        '🔗 Share via Code',
        '🎯 Drag-Drop Reordering'
      ]
    },
    {
      icon: <BrainIcon sx={{ fontSize: 40 }} />,
      title: 'For Learners',
      description: 'Take interactive quizzes with real-time feedback. Track your progress, view detailed results, and review your attempt history with beautiful animations.',
      color: '#00cec9',
      bg: 'rgba(0, 206, 201, 0.1)',
      highlights: [
        '⚡ Real-time Feedback',
        '📊 Progress Tracking',
        '🎨 Beautiful Animations',
        '📈 Detailed Results'
      ]
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'For Admins & Educators',
      description: 'Comprehensive admin panel for user management, quiz moderation, and platform statistics. Monitor performance and moderate content with ease.',
      color: '#ff7675',
      bg: 'rgba(255, 118, 117, 0.1)',
      highlights: [
        '👥 User Management',
        '🛡️ Quiz Moderation',
        '📊 Platform Statistics',
        '🎯 Performance Monitoring'
      ]
    },
  ];

  const testimonials = [
    {
      text: "QuizCraft revolutionized how I study for my medical exams. The AI generation is frighteningly accurate!",
      name: "Dr. Sarah Chen",
      role: "Medical Resident",
      avatar: "SC"
    },
    {
      text: "As a teacher, I save hours every week. My students actually look forward to taking quizzes now.",
      name: "Mark Johnson",
      role: "High School Teacher",
      avatar: "MJ"
    },
    {
      text: "The analytics are amazing. I can pinpoint exactly what I need to review before my finals.",
      name: "Emily Davis",
      role: "University Student",
      avatar: "ED"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 4, md: 6 },
          pb: { xs: 12, md: 16 },
          background: isDarkMode
            ? 'radial-gradient(circle at 15% 50%, rgba(108, 92, 231, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 206, 201, 0.15), transparent 25%)'
            : 'radial-gradient(circle at 15% 50%, rgba(108, 92, 231, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 206, 201, 0.08), transparent 25%)',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.4, pointerEvents: 'none', zIndex: -1 }}>
             <Box sx={{
                 position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, 
                 borderRadius: '50%', filter: 'blur(80px)', background: '#a29bfe', opacity: 0.3,
                 animation: 'pulse 10s infinite'
             }}/>
             <Box sx={{
                 position: 'absolute', bottom: '10%', left: '5%', width: 400, height: 400, 
                 borderRadius: '50%', filter: 'blur(100px)', background: '#74b9ff', opacity: 0.2
             }}/>
        </Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div initial="initial" animate="animate" variants={fadeInUp}>
                 <Chip
                    label="✨ Now with AI Generation"
                    icon={<SparkleIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        mb: 4,
                        px: 2,
                        py: 0.5,
                        fontWeight: 600,
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(108, 92, 231, 0.1)',
                        color: 'primary.main',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(108, 92, 231, 0.2)',
                        fontSize: '0.875rem',
                        '& .MuiChip-icon': {
                            color: 'primary.main'
                        }
                    }}
                />
                
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #fff 0%, #a29bfe 100%)' 
                        : 'linear-gradient(135deg, #2d3436 0%, #6c5ce7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: isDarkMode ? '0 0 40px rgba(162, 155, 254, 0.3)' : 'none',
                  }}
                >
                  Master Any Subject with QuizCraft
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    mb: 6,
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: { xs: '100%', md: 600 },
                    mx: 'auto',
                    textAlign: 'center'
                  }}
                >
                  Create, share, and play quizzes that adapt to your learning style. Join 10,000+ learners achieving their goals faster.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.5}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
                      boxShadow: '0 20px 40px -15px rgba(108, 92, 231, 0.5)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 25px 50px -15px rgba(108, 92, 231, 0.6)'
                      }
                    }}
                  >
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleExplore}
                    startIcon={<PlayIcon />}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      borderWidth: 2,
                      borderColor: 'divider',
                      color: 'text.primary',
                      width: { xs: '100%', sm: 'auto' },
                      transition: 'all 0.2s',
                      '&:hover': {
                          borderWidth: 2,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: 'rgba(108, 92, 231, 0.05)',
                          transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Explore Quizzes
                  </Button>
                </Stack>
                
                {/* Animated Metrics */}
                <Box sx={{ mt: 8, mx: 'auto', maxWidth: 800 }}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={3}>
                      <AnimatedCounter
                        end={10000}
                        suffix="+"
                        label="Active Users"
                        icon="👥"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <AnimatedCounter
                        end={50000}
                        suffix="+"
                        label="Quizzes Created"
                        icon="📝"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <AnimatedCounter
                        end={99.9}
                        suffix="%"
                        label="Uptime"
                        icon="⚡"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <AnimatedCounter
                        end={5}
                        suffix="/5"
                        label="User Rating"
                        icon="⭐"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
               <motion.div variants={floatAnimation} animate="animate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                   {/* Centered Box for Floating Elements */}
                   <Box sx={{
                       position: 'relative',
                       width: '100%',
                       maxWidth: 500,
                       p: { md: 2, lg: 4 },
                       pt: { md: 4, lg: 8 }
                   }}>
                       {/* Main Floating Card */}
                       <Card sx={{ 
                           position: 'relative', 
                           zIndex: 2, 
                           borderRadius: 5, 
                           boxShadow: isDarkMode ? '0 40px 100px -20px rgba(0,0,0,0.5)' : '0 50px 120px -30px rgba(50,50,93,0.3)',
                           background: isDarkMode ? '#1e1e1e' : '#fff',
                           border: '1px solid',
                           borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                           overflow: 'hidden'
                       }}>
                           <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, display: 'flex', gap: 1.5, bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                               <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57', boxShadow: '0 2px 4px rgba(255,95,87,0.3)' }} />
                               <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#febc2e', boxShadow: '0 2px 4px rgba(254,188,46,0.3)' }} />
                               <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c840', boxShadow: '0 2px 4px rgba(40,200,64,0.3)' }} />
                           </Box>
                           <CardContent sx={{ p: 5 }}>
                               <Chip size="small" label="Question 3/10" color="primary" sx={{ mb: 2, fontWeight: 700, borderRadius: 2 }} />
                               <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, lineHeight: 1.3 }}> What does the `useEffect` hook do in React?</Typography>
                               <Stack spacing={2}>
                                   <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, transition: 'all 0.2s', '&:hover': { borderColor: 'text.disabled', bgcolor: 'action.hover' } }}>
                                       <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', borderColor: 'text.disabled' }} />
                                       <Typography sx={{ fontWeight: 500 }}>Manages global state</Typography>
                                   </Box>
                                    <Box sx={{ p: 2.5, borderRadius: 3, border: '2px solid', borderColor: '#6C5CE7', bgcolor: 'rgba(108, 92, 231, 0.08)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                       <CheckIcon sx={{ color: '#6C5CE7' }} />
                                       <Typography sx={{ fontWeight: 600, color: '#6C5CE7' }}>Handles side effects</Typography>
                                   </Box>
                                   <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', opacity: 0.6 }}>
                                       <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', borderColor: 'text.disabled' }} />
                                       <Typography>Creates components</Typography>
                                   </Box>
                               </Stack>
                           </CardContent>
                       </Card>

                       {/* Decorative floating cards - Better positioned */}
                        <Card sx={{
                           position: 'absolute', top: { md: 0, lg: -10 }, right: { md: -10, lg: -30 },
                           zIndex: 3, width: 240,
                           p: 2.5, borderRadius: 4,
                           boxShadow: '0 20px 40px -15px rgba(0, 184, 148, 0.4)',
                           background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                           color: 'white',
                           transform: 'rotate(6deg)',
                           display: { xs: 'none', md: 'block' }
                       }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.9 }}>Current Streak</Typography>
                                <Typography variant="h5">🔥</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>12</Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>Days</Typography>
                            </Box>
                       </Card>

                       <Card sx={{
                           position: 'absolute', bottom: { md: -10, lg: -20 }, left: { md: -10, lg: -30 },
                           zIndex: 3, width: 220,
                           p: 2.5, borderRadius: 4,
                           boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                           background: isDarkMode ? '#2d3436' : '#fff',
                           border: '1px solid',
                           borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                           transform: 'rotate(-3deg)',
                           display: { xs: 'none', md: 'block' }
                       }}>
                           <Stack direction="row" spacing={2} alignItems="center">
                               <Box sx={{
                                   p: 1.5,
                                   bgcolor: 'rgba(108, 92, 231, 0.1)',
                                   borderRadius: 3,
                                   color: 'primary.main'
                               }}>
                                   <BoltIcon fontSize="large" />
                               </Box>
                               <Box>
                                   <Typography
                                       variant="caption"
                                       color="text.secondary"
                                       sx={{
                                           fontWeight: 600,
                                           textTransform: 'uppercase',
                                           letterSpacing: 1
                                       }}
                                   >
                                       Accuracy
                                   </Typography>
                                   <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
                                       94%
                                   </Typography>
                               </Box>
                           </Stack>
                       </Card>
                   </Box>
               </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How it Works Section */}
      <Box sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 0 },
        bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'grey.50'
      }}>
         <Container maxWidth="lg">
             <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                    SIMPLE WORKFLOW
                </Typography>
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  mt: 1,
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: '1.75rem', md: '2.5rem', lg: '3rem' }
                }}>
                    From Chaos to Structured Knowledge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                    Stop wasting time manually creating flashcards. Let our AI do the heavy lifting while you focus on learning.
                </Typography>
             </Box>

             <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="stretch">
                 {[
                     { step: '01', title: 'Upload or Paste', desc: 'Paste your notes or upload any PDF/Doc file directly to the platform.' },
                     { step: '02', title: 'AI Generation', desc: 'Our advanced AI analyzes your content and generates relevant questions instantly.' },
                     { step: '03', title: 'Master It', desc: 'Take the quiz, review explanations, and track your progress over time.' }
                 ].map((item, index) => (
                     <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                         <Box sx={{
                             p: { xs: 3, md: 3, lg: 4 },
                             width: '100%',
                             position: 'relative',
                             display: 'flex',
                             flexDirection: 'column'
                         }}>
                             <Typography variant="h1" sx={{
                                 position: 'absolute', top: 0, right: 20,
                                 opacity: 0.05,
                                 fontSize: { xs: '5rem', md: '6rem', lg: '8rem' },
                                 fontWeight: 900,
                                 pointerEvents: 'none'
                             }}>
                                 {item.step}
                             </Typography>
                             <Box sx={{
                                 width: { xs: 50, md: 55, lg: 60 },
                                 height: { xs: 50, md: 55, lg: 60 },
                                 borderRadius: '20px',
                                 bgcolor: 'primary.main',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 color: 'white',
                                 fontWeight: 700,
                                 mb: { xs: 2, md: 2.5, lg: 3 },
                                 boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)',
                                 position: 'relative',
                                 zIndex: 1,
                                 flexShrink: 0,
                                 fontSize: { xs: '1.1rem', md: '1.2rem' }
                             }}>
                                 {parseInt(item.step)}
                             </Box>
                             <Typography variant="h5" sx={{
                               fontWeight: 700,
                               mb: { xs: 1.5, md: 2 },
                               position: 'relative',
                               zIndex: 1,
                               flexShrink: 0,
                               fontSize: { xs: '1.1rem', md: '1.25rem', lg: '1.5rem' }
                             }}>
                               {item.title}
                             </Typography>
                             <Typography color="text.secondary" sx={{
                               position: 'relative',
                               zIndex: 1,
                               flexGrow: 1,
                               fontSize: { xs: '0.875rem', md: '0.95rem', lg: '1rem' },
                               lineHeight: { xs: 1.5, md: 1.6 }
                             }}>
                               {item.desc}
                             </Typography>
                         </Box>
                     </Grid>
                 ))}
             </Grid>
         </Container>
      </Box>

      {/* Interactive Demo Quiz */}
      <InteractiveDemoQuiz />

      {/* Features Grid - Three Pillars */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5, mb: 1 }}>
            BUILT FOR EVERYONE
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Powerful Features for Every User
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Whether you're creating quizzes, learning new topics, or managing a platform - QuizCraft has you covered with AI-powered tools.
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flexWrap: 'nowrap',
            '@media (max-width: 650px)': {
              flexWrap: 'wrap'
            }
          }}
        >
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              key={index}
              sx={{
                display: 'flex',
                flex: '1 1 0',
                minWidth: 0,
                '@media (max-width: 650px)': {
                  flex: 'none',
                  width: '100%'
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ width: '100%', display: 'flex' }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px -15px ${feature.color}50`,
                      borderColor: feature.color,
                      bgcolor: feature.bg,
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(3deg)',
                        bgcolor: feature.color,
                        color: 'white',
                        boxShadow: `0 8px 20px ${feature.color}40`
                      },
                      '& .feature-bg-blur': {
                        opacity: 0.5,
                        transform: 'scale(1.15)'
                      }
                    },
                  }}
                >
                  {/* Background blur effect */}
                  <Box
                    className="feature-bg-blur"
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: feature.color,
                      opacity: 0,
                      filter: 'blur(50px)',
                      transition: 'all 0.5s ease',
                      pointerEvents: 'none',
                    }}
                  />

                  <CardContent sx={{
                    p: 2.5,
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}>
                    {/* Icon and Title Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          color: feature.color,
                          bgcolor: feature.bg,
                          width: 56,
                          height: 56,
                          borderRadius: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {feature.title}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2, fontSize: '0.875rem' }}>
                      {feature.description}
                    </Typography>

                    {/* Highlights - Push to bottom */}
                    <Box sx={{ mt: 'auto', pt: 1 }}>
                      <Stack spacing={0.75}>
                        {feature.highlights.map((highlight, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.8125rem',
                              color: 'text.secondary'
                            }}
                          >
                            {highlight}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ py: 12, bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#F8F9FA' }}>
         <Container maxWidth="lg">
             <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 8 }}>
                 Loved by Learners
             </Typography>
             
             <Grid container spacing={4} justifyContent="center">
                 {testimonials.map((t, i) => (
                     <Grid item xs={12} md={4} key={i}>
                         <Card elevation={0} sx={{ 
                             p: 3, height: '100%', borderRadius: 4,
                             bgcolor: 'background.paper',
                             boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                         }}>
                             <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                 {[1,2,3,4,5].map(s => <Box key={s} sx={{ color: '#fdcb6e' }}>★</Box>)}
                             </Box>
                             <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic' }}>
                                 "{t.text}"
                             </Typography>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                 <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 700 }}>{t.avatar}</Avatar>
                                 <Box>
                                     <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                                     <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                                 </Box>
                             </Box>
                         </Card>
                     </Grid>
                 ))}
             </Grid>
         </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
            borderRadius: { xs: 4, md: 8 },
            p: { xs: 4, sm: 6, md: 8 },
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px -10px rgba(108, 92, 231, 0.5)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)',
              backgroundSize: '40px 40px',
              opacity: 0.3,
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '1.75rem', md: '3rem' } }}>
                Ready to Boost Your Learning?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  opacity: 0.9,
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Join thousands of learners. Start creating impactful quizzes today.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started for Free'}
              </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
         <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>QuizCraft</Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            © {new Date().getFullYear()} QuizCraft. All rights reserved.
         </Typography>
         <Typography variant="caption" color="text.disabled">
            Built with React 19 & Material-UI 7
         </Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
