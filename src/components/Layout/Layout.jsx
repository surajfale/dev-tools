import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar, { drawerWidth } from './Sidebar';
import Footer from './Footer';
import BootSequence from './BootSequence';

export default function Layout({ children, isDarkMode, onThemeToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: -9999,
          zIndex: 2000,
          '&:focus': { left: 16, top: 16, p: 1, bgcolor: 'accent.main', color: 'accent.contrastText' },
        }}
      >
        Skip to content
      </Box>
      <BootSequence />
      <Header
        onMenuClick={() => setMobileOpen((o) => !o)}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 52, sm: 56 } }} />
        <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4, lg: 6 }, py: { xs: 2, sm: 5 }, maxWidth: 1440, width: '100%' }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
