import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Toolbar,
  Box
} from '@mui/material';
import { 
  Dashboard,
  Code,
  Storage,
  Schedule,
  Article,
  SwapHoriz
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <Dashboard /> },
  { text: 'JSON Formatter', path: '/json-formatter', icon: <Code /> },
  { text: 'SQL Formatter', path: '/sql-formatter', icon: <Storage /> },
  { text: 'Timestamp Converter', path: '/timestamp-converter', icon: <Schedule /> },
  { text: 'Markdown ↔ HTML', path: '/markdown-html', icon: <Article /> },
  { text: 'JSON ↔ YAML', path: '/json-yaml', icon: <SwapHoriz /> },
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

  const drawer = (
    <Box role="navigation" aria-label="Main navigation">
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
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