import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Menu as MenuIcon, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { drawerWidth } from './Sidebar';

dayjs.extend(utc);
dayjs.extend(timezone);

const ZONES = [
  { label: 'UTC', tz: 'UTC' },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'IST', tz: 'Asia/Kolkata' },
];

const cell = { borderLeft: 1, borderColor: 'tokens.rule' };

function Clock({ label, value }) {
  return (
    <Box sx={{ ...cell, display: 'flex', alignItems: 'center', gap: 1, px: 1.75 }}>
      <Typography variant="caption" sx={{ fontWeight: 500, color: 'secondary.main' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
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
      <Toolbar disableGutters sx={{ minHeight: { xs: 52, sm: 56 }, alignItems: 'stretch' }}>
        <IconButton
          color="inherit"
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ width: 52, borderRight: 1, borderColor: 'tokens.rule', display: { md: 'none' } }}
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
            gap: 1.25,
            px: 2,
            width: { md: drawerWidth },
            flexShrink: 0,
            borderRight: { md: 1 },
            borderColor: { md: 'tokens.rule' },
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          <Box aria-hidden sx={{ width: 10, height: 10, bgcolor: 'accent.main', flexShrink: 0 }} />
          <Typography component="span" variant="h3" sx={{ fontSize: '1.45rem', lineHeight: 1, textTransform: 'uppercase' }}>
            Dev
            <Box component="span" sx={{ color: 'secondary.main', mx: 0.25 }}>/</Box>
            Tools
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 2,
          }}
        >
          <Box aria-hidden sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'success.main', flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" noWrap>
            SYS.NOMINAL · client-side only · 0 uplinks
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: { xs: 'block', lg: 'none' } }} />

        <Box role="group" aria-label="World clocks" sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'stretch' }}>
          {ZONES.map((z) => (
            <Clock key={z.tz} label={z.label} value={now.tz(z.tz).format('HH:mm:ss')} />
          ))}
        </Box>

        <Tooltip title={themeLabel}>
          <IconButton color="inherit" onClick={onThemeToggle} aria-label={themeLabel} sx={{ ...cell, width: 56 }}>
            {isDarkMode ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
