import { Fragment, useState } from 'react';
import { IconButton, Menu, MenuItem, ListSubheader, Tooltip, Box, Typography, Divider } from '@mui/material';
import { TuneOutlined, Check, PlayArrowOutlined } from '@mui/icons-material';
import { useSettings } from '../Common/settingsContext';

/** Each section is one radio group bound to a key in `settings`. */
const SECTIONS = [
  {
    key: 'typing',
    title: 'Output typing',
    options: [
      { value: 'auto', label: 'Auto', hint: 'Type it out unless your system asks for reduced motion' },
      { value: 'always', label: 'Always type', hint: 'Line-by-line reveal, even with reduced motion' },
      { value: 'off', label: 'Instant', hint: 'Show formatted output immediately' },
    ],
  },
  {
    key: 'intro',
    title: 'Intro sequence',
    options: [
      { value: 'session', label: 'Once per session', hint: 'Plays on the first visit after opening the browser' },
      { value: 'always', label: 'Every visit', hint: 'Plays on every full page load' },
      { value: 'off', label: 'Never', hint: 'Skip it. Always skipped with reduced motion' },
    ],
  },
];

const subheaderSx = {
  typography: 'overline',
  color: 'text.secondary',
  bgcolor: 'transparent',
  lineHeight: 2.6,
  borderBottom: 1,
  borderColor: 'divider',
};

function OptionText({ label, hint }) {
  return (
    <Box>
      <Typography sx={{ fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600 }}>{label}</Typography>
      {hint && <Typography sx={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.4 }}>{hint}</Typography>}
    </Box>
  );
}

/** Header control for user preferences: output typing and the intro sequence. */
export default function SettingsMenu({ sx }) {
  const { settings, updateSettings, replayIntro } = useSettings();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const close = () => setAnchor(null);

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
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ 'aria-labelledby': 'settings-button', dense: true, sx: { py: 0, width: 300 } }}
      >
        {SECTIONS.map((section, i) => (
          <Fragment key={section.key}>
            {i > 0 && <Divider sx={{ my: '0 !important' }} />}
            <ListSubheader disableSticky sx={subheaderSx}>
              {section.title}
            </ListSubheader>
            {section.options.map((opt) => {
              const checked = settings[section.key] === opt.value;
              return (
                <MenuItem
                  key={opt.value}
                  role="menuitemradio"
                  aria-checked={checked}
                  selected={checked}
                  onClick={() => {
                    updateSettings({ [section.key]: opt.value });
                    close();
                  }}
                  sx={{ alignItems: 'flex-start', gap: 1.5, py: 1.25, whiteSpace: 'normal' }}
                >
                  <Box sx={{ width: 18, pt: 0.25, flexShrink: 0 }}>{checked && <Check sx={{ fontSize: 18 }} />}</Box>
                  <OptionText label={opt.label} hint={opt.hint} />
                </MenuItem>
              );
            })}
          </Fragment>
        ))}
        <Divider sx={{ my: '0 !important' }} />
        <MenuItem
          onClick={() => {
            close();
            replayIntro();
          }}
          sx={{ gap: 1.5, py: 1.25 }}
        >
          <PlayArrowOutlined sx={{ fontSize: 18 }} />
          <OptionText label="Play intro now" />
        </MenuItem>
      </Menu>
    </>
  );
}
