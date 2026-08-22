import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  TerminalRounded
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
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            mr: 1.5,
          }}
        >
          <TerminalRounded fontSize="small" />
        </Box>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}
          aria-label="Developer Tools"
        >
          Developer Tools
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontFamily: '"JetBrains Mono", monospace',
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, fontVariantNumeric: 'tabular-nums' }}>
              EST {currentTime.est}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, fontVariantNumeric: 'tabular-nums' }}>
              IST {currentTime.ist}
            </Typography>
          </Box>

          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <IconButton
              color="inherit"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}