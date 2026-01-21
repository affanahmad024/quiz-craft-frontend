// Header Component
// Navigation header with logo, responsive design
// QuizCraft themed with green gradient

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Explore as ExploreIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth/AuthContextProvider';
import { ROUTES } from '../constants/RouteConstants';
import CreateQuizModal from '../components/modals/CreateQuizModal';

// Logo image - will be loaded from public folder
const logoImage = '/logo.png';

/**
 * Header Component
 * Responsive navigation header with logo
 * Different UI for authenticated vs guest users
 */
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);

  // Handlers
  const handleLogoClick = () => {
    navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleUserMenuClose();
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate(ROUTES.LOGIN);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { label: 'My Quizzes', path: ROUTES.QUIZ_LIST, icon: <QuizIcon /> },
    { label: 'Discover', path: ROUTES.DISCOVER, icon: <ExploreIcon /> },
  ];

  // Navigation items for guest users
  const guestNavItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Features', path: '/#features' },
    { label: 'About', path: '/#about' },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : guestNavItems;

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          backgroundColor: '#ffffff',
          color: '#2D3436',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={handleLogoClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 1.5,
                }}
              >
                <Box
                  component="img"
                  src={logoImage}
                  alt="QuizCraft Logo"
                  sx={{
                    height: { xs: 40, sm: 48 },
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    // Fallback if logo image not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Box
                  sx={{
                    display: 'none', // Show only if image fails to load
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  QuizCraft
                </Box>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Nav Items */}
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: isActive(item.path) ? '#0D5C3F' : '#636E72',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      borderBottom: isActive(item.path) ? '2px solid #0D5C3F' : 'none',
                      borderRadius: 0,
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(13, 92, 63, 0.05)',
                        color: '#0D5C3F',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Auth Buttons / User Menu */}
                {isAuthenticated ? (
                  <Box sx={{ display: 'flex', gap: 1.5, ml: 2, alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setCreateQuizModalOpen(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        px: 2,
                        py: 0.75,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
                        },
                      }}
                    >
                      + Create Quiz
                    </Button>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        p: 0.5,
                        border: '2px solid',
                        borderColor: userMenuAnchor ? '#0D5C3F' : 'transparent',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#0D5C3F',
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                        }}
                      >
                        {getInitials(user?.name)}
                      </Avatar>
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleNavigate(ROUTES.LOGIN)}
                      sx={{
                        borderColor: '#0D5C3F',
                        color: '#0D5C3F',
                        '&:hover': {
                          borderColor: '#0D5C3F',
                          backgroundColor: 'rgba(13, 92, 63, 0.05)',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleNavigate(ROUTES.SIGNUP)}
                      sx={{
                        background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                        color: '#ffffff',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                        },
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{ color: '#0D5C3F' }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Menu (Desktop) */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {user?.name}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {user?.email}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate(ROUTES.PROFILE)}>
          <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate(ROUTES.PROFILE_STATS)}>
          <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #E0E0E0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#0D5C3F', width: 48, height: 48 }}>
                  {getInitials(user.name)}
                </Avatar>
                <Box>
                  <Box sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {user.name}
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {user.email}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Navigation List */}
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) ? 'rgba(13, 92, 63, 0.1)' : 'transparent',
                  color: isActive(item.path) ? '#0D5C3F' : 'inherit',
                }}
              >
                {item.icon && <Box sx={{ mr: 2, display: 'flex' }}>{item.icon}</Box>}
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}

            {isAuthenticated && (
              <>
                <Divider sx={{ my: 2 }} />
                <ListItem
                  button
                  onClick={() => handleNavigate(ROUTES.PROFILE)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <AccountCircle sx={{ mr: 2 }} />
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => handleNavigate(ROUTES.PROFILE_STATS)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <SettingsIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem
                  button
                  onClick={handleLogout}
                  sx={{ borderRadius: 2, color: 'error.main' }}
                >
                  <LogoutIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleNavigate(ROUTES.LOGIN)}
                    sx={{
                      borderColor: '#0D5C3F',
                      color: '#0D5C3F',
                      mb: 1,
                    }}
                  >
                    Login
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleNavigate(ROUTES.SIGNUP)}
                    sx={{
                      background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                    }}
                  >
                    Sign Up
                  </Button>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        open={createQuizModalOpen}
        onClose={() => setCreateQuizModalOpen(false)}
      />
    </>
  );
}

export default Header;
