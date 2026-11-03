import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListSubheader, Tooltip, Box, Typography } from '@mui/material';
import { TuneOutlined, Check } from '@mui/icons-material';
import { useSettings } from '../Common/settingsContext';

const TYPING_OPTIONS = [
  { value: 'auto', label: 'Auto', hint: 'Type it out unless your system asks for reduced motion' },
  { value: 'always', label: 'Always type', hint: 'Line-by-line reveal, even with reduced motion' },
  { value: 'off', label: 'Instant', hint: 'Show formatted output immediately' },
];

/** Header control for user preferences (currently: how output appears). */
export default function SettingsMenu({ sx }) {
  const { settings, updateSettings } = useSettings();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const choose = (typing) => {
    updateSettings({ typing });
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          color="inherit"
          aria-label="Settings"
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'settings-menu' : undefined}
          id="settings-button"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={sx}
        >
          <TuneOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="settings-menu"
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ 'aria-labelledby': 'settings-button', dense: true, sx: { py: 0, width: 300 } }}
      >
        <ListSubheader
          disableSticky
          sx={{ typography: 'overline', color: 'text.secondary', bgcolor: 'transparent', lineHeight: 2.6, borderBottom: 1, borderColor: 'divider' }}
        >
          Output typing
        </ListSubheader>
        {TYPING_OPTIONS.map((opt) => {
          const checked = settings.typing === opt.value;
          return (
            <MenuItem
              key={opt.value}
              role="menuitemradio"
              aria-checked={checked}
              selected={checked}
              onClick={() => choose(opt.value)}
              sx={{ alignItems: 'flex-start', gap: 1.5, py: 1.25, whiteSpace: 'normal' }}
            >
              <Box sx={{ width: 18, pt: 0.25, flexShrink: 0 }}>{checked && <Check sx={{ fontSize: 18 }} />}</Box>
              <Box>
                <Typography sx={{ fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600 }}>{opt.label}</Typography>
                <Typography sx={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.4 }}>{opt.hint}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
