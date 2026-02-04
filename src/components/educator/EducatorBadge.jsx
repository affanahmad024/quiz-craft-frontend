import { Chip } from "@mui/material";

function EducatorBadge({ verified }) {
  if (!verified) return null;
  return <Chip label="Verified" size="small" color="primary" />;
}

export default EducatorBadge;
