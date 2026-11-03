import { Drawer, List, ListItem, ListItemButton, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { tools } from './toolRegistry';

export const drawerWidth = 248;

const items = [{ code: '00', short: 'Index', path: '/' }, ...tools];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onMobileClose?.();
  };

  const drawer = (
    <Box role="navigation" aria-label="Main navigation" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 60 } }} />
      <Typography variant="overline" color="text.secondary" sx={{ px: 2, pt: 2.5, pb: 1, display: 'block' }}>
        ── Contents
      </Typography>
      <List disablePadding>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                sx={{
                  py: 1.1,
                  px: 2,
                  gap: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  position: 'relative',
                  '&:hover': { bgcolor: 'action.hover', '& .nav-arrow': { opacity: 1, transform: 'translateX(0)' } },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    bgcolor: 'text.primary',
                    color: 'background.default',
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    width: 26,
                    textAlign: 'center',
                    color: isActive ? 'accent.contrastText' : 'text.secondary',
                    bgcolor: isActive ? 'accent.main' : 'transparent',
                  }}
                >
                  {item.code}
                </Typography>
                <Typography component="span" sx={{ flex: 1, fontSize: '0.92rem', fontWeight: isActive ? 600 : 400 }}>
                  {item.short}
                </Typography>
                <Box
                  component="span"
                  aria-hidden
                  className="nav-arrow"
                  sx={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'none' : 'translateX(-4px)',
                    transition: 'opacity 120ms, transform 120ms',
                  }}
                >
                  →
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2, borderTop: 2, borderColor: 'text.primary' }}>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ lineHeight: 1.6 }}>
          Everything runs in your browser.
          <br />
          Nothing is uploaded. Ever.
        </Typography>
      </Box>
    </Box>
  );

  const paperSx = { boxSizing: 'border-box', width: drawerWidth };

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Tools">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': paperSx }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': paperSx }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
