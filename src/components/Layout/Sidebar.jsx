import { Drawer, List, ListItem, ListItemButton, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { tools } from './toolRegistry';

export const drawerWidth = 232;

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
      <Toolbar sx={{ minHeight: { xs: 52, sm: 56 } }} />
      <Typography variant="overline" color="text.secondary" sx={{ px: 2, pt: 2.5, pb: 1, display: 'block' }}>
        Contents
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
                  py: 1,
                  px: 2,
                  gap: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover', '& .nav-code::before': { content: '"▸"' } },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    bgcolor: 'accent.main',
                    color: 'accent.contrastText',
                  },
                }}
              >
                <Typography
                  className="nav-code"
                  component="span"
                  variant="caption"
                  sx={{
                    width: 22,
                    color: isActive ? 'inherit' : 'text.secondary',
                    position: 'relative',
                    '&::before': { position: 'absolute', left: -12 },
                  }}
                >
                  {item.code}
                </Typography>
                <Typography component="span" sx={{ flex: 1, fontSize: '0.88rem', fontWeight: isActive ? 600 : 400 }}>
                  {item.short}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'tokens.rule' }}>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ lineHeight: 1.7 }}>
          Runs in your browser.
          <br />
          Nothing is uploaded.
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
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': paperSx }}>
        {drawer}
      </Drawer>
    </Box>
  );
}
