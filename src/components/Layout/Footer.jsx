import { Box, Typography } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
      role="contentinfo"
    >
      <Typography variant="body2" color="text.secondary">
        © {currentYear} Developer Tools. Built by <b>Suraj</b> with React + Material UI.
      </Typography>
    </Box>
  );
}