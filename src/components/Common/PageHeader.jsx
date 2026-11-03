import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { findTool, tools } from '../Layout/toolRegistry';

/**
 * Console-style page header shared by every tool.
 *   [T/01] JSON ─────────────────────── 01 / 07
 *   JSON FORMATTER
 *   Description text…              RUN [Ctrl/⌘] + [Enter]
 */
export default function PageHeader({ title, children, shortcut = true }) {
  const { pathname } = useLocation();
  const tool = findTool(pathname);

  return (
    <Box component="header" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        {tool && (
          <Box
            component="span"
            sx={{ typography: 'overline', fontWeight: 600, px: 1, bgcolor: 'accent.main', color: 'accent.contrastText', lineHeight: 1.8 }}
          >
            T/{tool.code}
          </Box>
        )}
        {tool && (
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
            {tool.tag}
          </Typography>
        )}
        <Box aria-hidden sx={{ flex: 1, borderTop: 1, borderColor: 'tokens.rule' }} />
        {tool && (
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
            {tool.code} / {String(tools.length).padStart(2, '0')}
          </Typography>
        )}
      </Box>

      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: { xs: '2.6rem', sm: '3.5rem', md: '4rem' }, mb: 1.5, textWrap: 'balance' }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '68ch' }}>
          {children}
        </Typography>
        {shortcut && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75, flexShrink: 0 }}
          >
            RUN <kbd>Ctrl/⌘</kbd>+<kbd>Enter</kbd>
          </Typography>
        )}
      </Box>
    </Box>
  );
}
