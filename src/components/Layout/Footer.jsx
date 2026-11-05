import { Box, Typography } from '@mui/material';

// Read once at module load: render must stay pure, and the year rolling over
// mid-session is not worth an effect.
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        mt: 'auto',
        px: { xs: 2, sm: 4, lg: 6 },
        py: 1.75,
        borderTop: 1,
        borderColor: 'tokens.rule',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 1,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        © {year} DEV/TOOLS · built by{' '}
        <Box component="b" sx={{ color: 'text.primary', fontWeight: 500 }}>
          Suraj
        </Box>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        REACT · MUI · VITE · 0 UPLINKS
      </Typography>
    </Box>
  );
}
