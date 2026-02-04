import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import EducatorBadge from "./EducatorBadge";

function EducatorCard({ educator }) {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              {educator.display_name || educator.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {educator.tagline}
            </Typography>
          </Box>
          <EducatorBadge verified={educator.verified} />
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button variant="contained">View</Button>
          <Button variant="outlined">Follow</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EducatorCard;
