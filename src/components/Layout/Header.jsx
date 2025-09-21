import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Header({
  onMenuClick,
  isDarkMode,
  onThemeToggle
}) {
  const [currentTime, setCurrentTime] = useState({
    est: '',
    ist: ''
  });

  useEffect(() => {
    const updateTime = () => {
      const now = dayjs();
      setCurrentTime({
        est: now.tz('America/New_York').format('MMM DD, h:mm A'),
        ist: now.tz('Asia/Kolkata').format('MMM DD, h:mm A')
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
          aria-label="Developer Tools"
        >
          Developer Tools
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="caption" sx={{ lineHeight: 1.2, opacity: 0.9 }}>
              EST: {currentTime.est}
            </Typography>
            <Typography variant="caption" sx={{ lineHeight: 1.2, opacity: 0.9 }}>
              IST: {currentTime.ist}
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            onClick={onThemeToggle}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}