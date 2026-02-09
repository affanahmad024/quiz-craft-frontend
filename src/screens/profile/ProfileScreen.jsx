// Profile Screen - Modern Design with Inline Editing
// Complete user profile management with all features
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  Paper,
  Badge,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Quiz as QuizIcon,
  Grade as ScoreIcon,
  CheckCircle as CheckCircleIcon,
  Stars as StarsIcon,
  Whatshot as WhatshotIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Verified as VerifiedIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/RouteConstants';
import { COLORS } from '../../constants/ColorConstants';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import StatsCard from '../../components/profile/StatsCard';
import { useProfile } from '../../contexts/profile/ProfileContextProvider';
import { useAuth } from '../../contexts/auth/AuthContextProvider';
import { promoteToEducator } from '../../services/educator/EducatorServices';
import useNetReq from '../../hooks/NetworkRequest';
import toast from 'react-hot-toast';

/**
 * Modern Profile Screen with Inline Editing
 */
function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, statistics, isLoading, getProfile, getStatistics, updateProfile, deleteAccount } = useProfile();
  const { fetchData } = useNetReq();

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Educator promotion modal
  const [educatorModalOpen, setEducatorModalOpen] = useState(false);
  const [educatorData, setEducatorData] = useState({
    bio: '',
    expertise: '',
    credentials: '',
  });
  const [promotingEducator, setPromotingEducator] = useState(false);

  // Delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      await Promise.all([getProfile(), getStatistics()]);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    }
  };

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form data
      setFormData({
        name: profile?.name || '',
        phone_number: profile?.phone_number || '',
      });
      setErrors({});
    }
    setIsEditMode(!isEditMode);
  };

  // Handle input change
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.phone_number && formData.phone_number.trim().length > 0) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone_number.trim())) {
        newErrors.phone_number = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const updates = {};
      if (formData.name !== profile?.name) {
        updates.name = formData.name.trim();
      }
      if (formData.phone_number !== profile?.phone_number) {
        updates.phone_number = formData.phone_number.trim() || null;
      }

      if (Object.keys(updates).length === 0) {
        toast.info('No changes to save');
        setIsEditMode(false);
        return;
      }

      const response = await updateProfile(updates);

      if (response.success) {
        toast.success('Profile updated successfully!');
        setIsEditMode(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle educator promotion
  const handlePromoteToEducator = async () => {
    if (!educatorData.bio.trim()) {
      toast.error('Please provide a bio');
      return;
    }

    setPromotingEducator(true);
    try {
      const abortContRef = { current: null };
      const response = await promoteToEducator(fetchData, abortContRef, {
        profileData: {
          bio: educatorData.bio.trim(),
          expertise: educatorData.expertise.split(',').map(e => e.trim()).filter(Boolean),
          credentials: educatorData.credentials.trim(),
        },
      });

      if (response.success) {
        toast.success('Congratulations! You are now an educator!');
        setEducatorModalOpen(false);
        await getProfile(); // Refresh profile to show educator role
      } else {
        toast.error(response.message || 'Failed to promote to educator');
      }
    } catch (error) {
      console.error('Educator promotion error:', error);
      toast.error('An error occurred during promotion');
    } finally {
      setPromotingEducator(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteAccount();

      if (response.success) {
        toast.success('Account deleted successfully');
        setDeleteDialogOpen(false);
        setTimeout(() => {
          logout();
          navigate(ROUTES.HOME);
        }, 1000);
      } else {
        toast.error(response.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('An error occurred while deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'educator':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  const isEducator = profile?.role === 'educator' || user?.role === 'educator';
  const isAdmin = profile?.role === 'admin' || user?.role === 'admin';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
            }}
          >
            My Profile
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Manage your account and view your achievements
          </Typography>
        </Box>

        {/* Main Profile Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header with Avatar and Edit Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    (profile?.email_verified || user?.email_verified) && (
                      <Tooltip title="Verified Account">
                        <VerifiedIcon
                          sx={{
                            width: 24,
                            height: 24,
                            color: COLORS.SUCCESS,
                            bgcolor: 'white',
                            borderRadius: '50%',
                          }}
                        />
                      </Tooltip>
                    )
                  }
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: COLORS.PRIMARY_LIGHT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                      border: `4px solid ${COLORS.PRIMARY}`,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 50, color: COLORS.PRIMARY }} />
                  </Box>
                </Badge>

                <Box sx={{ flex: 1 }}>
                  {isEditMode ? (
                    <QuizCraftTextInput
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      fullWidth
                      autoFocus
                      sx={{ mb: 1 }}
                    />
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {profile?.name || user?.name || 'User'}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={profile?.role || user?.role || 'user'}
                      color={getRoleBadgeColor(profile?.role || user?.role)}
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                    />
                    {(profile?.email_verified || user?.email_verified) && (
                      <Chip
                        label="Verified"
                        color="success"
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                    )}
                    {(profile?.enabled !== false) && (
                      <Chip label="Active" color="success" size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Edit/Save/Cancel Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isEditMode ? (
                  <>
                    <Tooltip title="Save Changes">
                      <IconButton
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        sx={{
                          bgcolor: COLORS.SUCCESS,
                          color: 'white',
                          '&:hover': { bgcolor: COLORS.SUCCESS, opacity: 0.8 },
                        }}
                      >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton
                        onClick={handleEditToggle}
                        disabled={isSaving}
                        sx={{
                          bgcolor: COLORS.ERROR,
                          color: 'white',
                          '&:hover': { bgcolor: COLORS.ERROR, opacity: 0.8 },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="Edit Profile">
                    <IconButton
                      onClick={handleEditToggle}
                      sx={{
                        bgcolor: COLORS.PRIMARY,
                        color: 'white',
                        '&:hover': { bgcolor: COLORS.PRIMARY, opacity: 0.8 },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Profile Details Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1">
                      {profile?.email || user?.email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Phone Number
                    </Typography>
                    {isEditMode ? (
                      <QuizCraftTextInput
                        value={formData.phone_number}
                        onChange={handleInputChange('phone_number')}
                        error={Boolean(errors.phone_number)}
                        helperText={errors.phone_number}
                        fullWidth
                        size="small"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <Typography variant="body1">
                        {profile?.phone_number || 'Not provided'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(profile?.created_at || user?.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1.5, color: COLORS.PRIMARY }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Last Active
                    </Typography>
                    <Typography variant="body1">
                      {formatRelativeTime(profile?.last_login_at || profile?.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!isEducator && !isAdmin && (
                <QuizCraftButton
                  variant="contained"
                  onClick={() => setEducatorModalOpen(true)}
                  startIcon={<SchoolIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B 0%, #FFE66D 100%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252 0%, #FFD54F 100%)',
                    },
                  }}
                >
                  Become an Educator
                </QuizCraftButton>
              )}

              {isEducator && (
                <QuizCraftButton
                  variant="outlined"
                  onClick={() => navigate(ROUTES.MY_EDUCATOR_PROFILE)}
                  startIcon={<SchoolIcon />}
                >
                  View Educator Profile
                </QuizCraftButton>
              )}

              <QuizCraftButton
                variant="outlined"
                onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                startIcon={<LockIcon />}
              >
                Change Password
              </QuizCraftButton>

              <QuizCraftButton
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                startIcon={<DeleteIcon />}
              >
                Delete Account
              </QuizCraftButton>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Box sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ color: 'white' }} />
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Your Performance
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Quizzes Created"
              value={statistics?.quizzes_created || 0}
              icon={QuizIcon}
              color={COLORS.PRIMARY}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Quizzes Taken"
              value={statistics?.total_quiz_attempts || statistics?.quizzes_taken || 0}
              icon={QuizIcon}
              color={COLORS.INFO}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Average Score"
              value={
                statistics?.average_score
                  ? `${Math.round(statistics.average_score)}%`
                  : '0%'
              }
              icon={ScoreIcon}
              color={COLORS.SUCCESS}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Pass Rate"
              value={
                statistics?.pass_rate
                  ? `${Math.round(statistics.pass_rate)}%`
                  : '0%'
              }
              icon={CheckCircleIcon}
              color={COLORS.SECONDARY}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Total Points"
              value={statistics?.total_points_earned || 0}
              icon={StarsIcon}
              color={COLORS.WARNING}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Current Streak"
              value={statistics?.current_streak || 0}
              icon={WhatshotIcon}
              color={COLORS.ERROR}
              subtitle="days"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Educator Promotion Modal */}
      <Dialog
        open={educatorModalOpen}
        onClose={() => !promotingEducator && setEducatorModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: COLORS.PRIMARY }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Become an Educator
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            As an educator, you can create public quizzes, host live sessions, and build your follower base!
          </Alert>

          <TextField
            label="Bio"
            placeholder="Tell us about yourself..."
            value={educatorData.bio}
            onChange={(e) => setEducatorData({ ...educatorData, bio: e.target.value })}
            multiline
            rows={3}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Expertise"
            placeholder="e.g., JavaScript, Python, Mathematics (comma-separated)"
            value={educatorData.expertise}
            onChange={(e) => setEducatorData({ ...educatorData, expertise: e.target.value })}
            fullWidth
            helperText="Separate multiple topics with commas"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Credentials"
            placeholder="Your qualifications, certifications, or experience..."
            value={educatorData.credentials}
            onChange={(e) => setEducatorData({ ...educatorData, credentials: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <QuizCraftButton
            variant="outlined"
            onClick={() => setEducatorModalOpen(false)}
            disabled={promotingEducator}
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            onClick={handlePromoteToEducator}
            loading={promotingEducator}
            disabled={promotingEducator || !educatorData.bio.trim()}
          >
            Become Educator
          </QuizCraftButton>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon sx={{ color: COLORS.ERROR }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.ERROR }}>
              Delete Account
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              All your quizzes, attempts, and data will be permanently deleted.
            </Typography>
          </Alert>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Type <strong>DELETE</strong> to confirm:
          </Typography>

          <TextField
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <QuizCraftButton
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </QuizCraftButton>
          <QuizCraftButton
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            loading={isDeleting}
            disabled={isDeleting || deleteConfirmText.toLowerCase() !== 'delete'}
            startIcon={<DeleteIcon />}
          >
            Delete Account
          </QuizCraftButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfileScreen;
