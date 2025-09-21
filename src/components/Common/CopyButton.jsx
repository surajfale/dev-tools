import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

export default function CopyButton({ text, disabled = false, size = 'small' }) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOpen(true);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleCopy}
        disabled={disabled || !text}
        startIcon={<ContentCopy />}
        size={size}
        variant="outlined"
        aria-label="Copy to clipboard"
      >
        Copy
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}