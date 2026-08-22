import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard,
  Code,
  Storage,
  Schedule,
  Article,
  SwapHoriz,
  Visibility,
  Calculate
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', path: '/', icon: <Dashboard /> },
];

const toolItems = [
  { text: 'JSON Formatter', path: '/json-formatter', icon: <Code /> },
  { text: 'SQL Formatter', path: '/sql-formatter', icon: <Storage /> },
  { text: 'Timestamp Converter', path: '/timestamp-converter', icon: <Schedule /> },
  { text: 'Markdown ↔ HTML', path: '/markdown-html', icon: <Article /> },
  { text: 'JSON ↔ YAML', path: '/json-yaml', icon: <SwapHoriz /> },
  { text: 'HTML Preview', path: '/html-preview', icon: <Visibility /> },
  { text: 'Math Calculator', path: '/math-calculator', icon: <Calculate /> },
];

export default function Sidebar({ 
  mobileOpen, 
  onMobileClose, 
  window 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onMobileClose?.();
  };

  const renderItem = (item) => {
    const isActive = location.pathname === item.path;
    return (
      <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
        <ListItemButton
          onClick={() => handleNavigation(item.path)}
          selected={isActive}
          aria-current={isActive ? 'page' : undefined}
        >
          <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box role="navigation" aria-label="Main navigation">
      <Toolbar />
      <List sx={{ px: 0.5, pt: 1 }}>
        {navItems.map(renderItem)}
      </List>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          px: 3,
          pt: 1.5,
          pb: 0.5,
          color: 'text.disabled',
          fontWeight: 600,
          letterSpacing: '0.08em',
        }}
      >
        TOOLS
      </Typography>
      <List sx={{ px: 0.5 }}>
        {toolItems.map(renderItem)}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="navigation menu"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}