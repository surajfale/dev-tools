import { useState } from 'react';
import { Box, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { ContentPaste } from '@mui/icons-material';

export const PHONE_QUERY = '(max-width: 599.95px)';

/**
 * A tool's main actions.
 *  - sm and up: the usual inline row (primary first, then outlined actions).
 *  - phones: fixed to the bottom of the screen, above Android's gesture bar
 *    and (with `interactive-widget=resizes-content`) above the keyboard.
 *    Secondary actions collapse to 48px icon buttons and the primary action
 *    takes the remaining width on the right, where the thumb is.
 *
 * `primary` / `actions` items: { label, icon, onClick, disabled, color }.
 * `onPaste(text)` adds a Paste action (phones only; desktop has Ctrl+V).
 * Layout.jsx pads <main> while a bar is mounted so it never hides content.
 */
export default function ToolActionBar({ primary, actions = [], onPaste }) {
  const [pasteError, setPasteError] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onPaste(text);
      else setPasteError('Clipboard is empty');
    } catch {
      // Permission denied or API missing: long-press paste still works.
      setPasteError('Clipboard access was blocked. Long-press the input to paste.');
    }
  };

  const phoneActions = onPaste
    ? [{ label: 'Paste from clipboard', icon: <ContentPaste />, onClick: handlePaste }, ...actions]
    : actions;

  return (
    <>
      {/* Tablet / desktop: inline row */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', gap: 1, mt: 2 }}>
        <Button variant="contained" startIcon={primary.icon} onClick={primary.onClick} disabled={primary.disabled}>
          {primary.label}
        </Button>
        {actions.map((a) => (
          <Button
            key={a.label}
            variant="outlined"
            color={a.color ?? 'primary'}
            startIcon={a.icon}
            onClick={a.onClick}
            disabled={a.disabled}
            aria-label={a.ariaLabel}
          >
            {a.label}
          </Button>
        ))}
      </Box>

      {/* Phone: fixed bottom bar */}
      <Box
        data-action-bar
        role="toolbar"
        aria-label="Tool actions"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (t) => t.zIndex.appBar,
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          pt: 1,
          pb: 'calc(8px + env(safe-area-inset-bottom))',
          bgcolor: 'background.default',
          borderTop: 1,
          borderColor: 'tokens.rule',
        }}
      >
        {phoneActions.map((a) => (
          <IconButton
            key={a.label}
            aria-label={a.ariaLabel ?? a.label}
            onClick={a.onClick}
            disabled={a.disabled}
            color={a.color === 'error' ? 'error' : 'inherit'}
            sx={{ width: 48, height: 48, border: 1, borderColor: 'tokens.rule', flexShrink: 0 }}
          >
            {a.icon}
          </IconButton>
        ))}
        <Button
          variant="contained"
          startIcon={primary.icon}
          onClick={primary.onClick}
          disabled={primary.disabled}
          sx={{ flex: 1, minHeight: 48 }}
        >
          {primary.label}
        </Button>
      </Box>

      <Snackbar open={Boolean(pasteError)} autoHideDuration={3000} onClose={() => setPasteError('')}>
        <Alert severity="info" variant="filled" onClose={() => setPasteError('')}>
          {pasteError}
        </Alert>
      </Snackbar>
    </>
  );
}
