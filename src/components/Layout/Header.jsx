import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Menu as MenuIcon, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FONT_DISPLAY } from '../../theme';

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONES = [
  { label: 'UTC', tz: 'UTC' },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'IST', tz: 'Asia/Kolkata' },
];

function Clock({ label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        alignSelf: 'stretch',
        borderLeft: 2,
        borderColor: 'text.primary',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function Header({ onMenuClick, isDarkMode, onThemeToggle }) {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const themeLabel = `Switch to ${isDarkMode ? 'light' : 'dark'} mode`;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.default' }}
    >
      <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 60 }, alignItems: 'stretch' }}>
        <IconButton
          color="inherit"
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ width: 56, borderRight: 2, borderColor: 'text.primary', display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Wordmark — occupies exactly the sidebar column on desktop */}
        <Box
          component={RouterLink}
          to="/"
          aria-label="Dev Tools home"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            width: { md: 248 },
            flexShrink: 0,
            borderRight: { md: 2 },
            borderColor: { md: 'text.primary' },
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 14,
              height: 14,
              bgcolor: 'accent.main',
              border: 2,
              borderColor: 'text.primary',
              flexShrink: 0,
            }}
          />
          <Typography
            component="span"
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 900,
              fontStretch: '70%',
              fontSize: '1.6rem',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            Dev
            <Box component="span" sx={{ color: 'secondary.main' }}>/</Box>
            Tools
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" noWrap>
            client-side only · zero uploads · no tracking
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: { xs: 'block', lg: 'none' } }} />

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'stretch' }} role="group" aria-label="World clocks">
          {ZONES.map((z) => (
            <Clock key={z.tz} label={z.label} value={now.tz(z.tz).format('HH:mm:ss')} />
          ))}
        </Box>

        <Tooltip title={themeLabel}>
          <IconButton
            color="inherit"
            onClick={onThemeToggle}
            aria-label={themeLabel}
            sx={{ width: 60, borderLeft: 2, borderColor: 'text.primary' }}
          >
            {isDarkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
