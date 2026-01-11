// Edit Profile Screen
// Edit user profile information
// Following Phoenix pattern

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '../../constants/RouteConstants';
import QuizCraftTextInput from '../../components/inputs/QuizCraftTextInput';
import QuizCraftButton from '../../components/buttons/QuizCraftButton';
import { useProfile } from '../../contexts/profile/ProfileContextProvider';
import toast from 'react-hot-toast';

/**
 * Edit Profile Screen
 * Allows users to update their profile information
 */
function EditProfileScreen() {
  const navigate = useNavigate();
  const { profile, isLoading, getProfile, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setFormData({
          name: response.data.name || '',
          phone_number: response.data.phone_number || '',
        });
      }
    };

    fetchProfile();
  }, []);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Name must not exceed 255 characters';
    }

    // Phone number validation (optional, but if provided should be valid)
    if (formData.phone_number && formData.phone_number.trim().length > 0) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone_number.trim())) {
        newErrors.phone_number = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Prepare updates (only send fields that have changed)
      const updates = {};
      if (formData.name !== profile?.name) {
        updates.name = formData.name.trim();
      }
      if (formData.phone_number !== profile?.phone_number) {
        updates.phone_number = formData.phone_number.trim() || null;
      }

      // Check if there are any changes
      if (Object.keys(updates).length === 0) {
        toast.info('No changes to save');
        setIsSaving(false);
        return;
      }

      const response = await updateProfile(updates);

      if (response.success) {
        toast.success('Profile updated successfully!');
        navigate(ROUTES.PROFILE);
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

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
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
          background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={handleCancel}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

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
            Edit Profile
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Update your profile information
          </Typography>
        </Box>

        {/* Form Card */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <QuizCraftTextInput
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={Boolean(errors.name)}
                helperText={errors.name}
                required
                fullWidth
                autoFocus
                placeholder="Enter your name"
                sx={{ mb: 3 }}
              />

              <QuizCraftTextInput
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleInputChange('phone_number')}
                error={Boolean(errors.phone_number)}
                helperText={errors.phone_number || 'Optional'}
                fullWidth
                placeholder="Enter your phone number"
                sx={{ mb: 4 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <QuizCraftButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Save Changes
                </QuizCraftButton>
                <QuizCraftButton
                  type="button"
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </QuizCraftButton>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default EditProfileScreen;
