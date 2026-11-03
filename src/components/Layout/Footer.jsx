import { Box, Typography } from '@mui/material';

export default function Footer() {
  const year = new Date().getFullYear();

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
