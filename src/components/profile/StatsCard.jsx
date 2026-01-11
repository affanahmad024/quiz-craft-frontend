// Stats Card Component
// Display statistics card
// Following Phoenix pattern

import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { COLORS } from '../../constants/ColorConstants';

/**
 * Stats Card Component
 * Displays a single statistic with icon
 */
function StatsCard({ title, value, icon: Icon, color = COLORS.PRIMARY, subtitle }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {Icon && (
            <Box
              sx={{
                bgcolor: `${color}15`,
                borderRadius: 2,
                p: 1.5,
                mr: 2,
              }}
            >
              <Icon sx={{ fontSize: 32, color }} />
            </Box>
          )}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  subtitle: PropTypes.string,
};

export default StatsCard;
