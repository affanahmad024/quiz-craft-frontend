// Auth Navigation Bar
// Top navigation bar for authentication pages
// Matches ERPICA template design with green theme

import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/RouteConstants';

const logoImage = '/logo.png';

function AuthNavbar({ currentPage = 'login' }) {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'About', path: ROUTES.HOME + '#about' },
    { label: 'Services', path: ROUTES.HOME + '#services' },
    { label: 'Pricing', path: ROUTES.HOME + '#pricing' },
    { label: 'FAQs', path: ROUTES.HOME + '#faqs' },
    { label: 'Contact Us', path: ROUTES.HOME + '#contact' },
    { label: 'Documentation', path: ROUTES.HOME + '#docs' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#2D2D2D',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            py: 1.5,
            px: { xs: 2, sm: 3 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <Box
              component="img"
              src={logoImage}
              alt="QuizCraft Logo"
              sx={{
                height: 40,
                width: 'auto',
                mr: 1,
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              flex: 1,
              justifyContent: 'center',
              ml: 4,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.label}
                onClick={() => navigate(link.path)}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {currentPage !== 'login' && (
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sign In
              </Button>
            )}
            {currentPage !== 'signup' && (
              <Button
                onClick={() => navigate(ROUTES.SIGNUP)}
                sx={{
                  background: 'linear-gradient(135deg, #0D5C3F 0%, #7ED957 100%)',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0A4A32 0%, #6BC047 100%)',
                  },
                }}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AuthNavbar;
