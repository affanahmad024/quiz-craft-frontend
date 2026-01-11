// Page Not Found Component
// Following Phoenix pattern

import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/RouteConstants';

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', md: '10rem' },
          fontWeight: 700,
          color: 'primary.main',
        }}
      >
        404
      </Typography>

      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(ROUTES.HOME)}
      >
        Go to Home
      </Button>
    </Box>
  );
}

export default PageNotFound;
