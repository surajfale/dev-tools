import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { sanitizeHtml } from '../lib/previewHtml';

export default function SharedPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const encodedHtml = searchParams.get('content');

  // Pure function of the URL, so derive it rather than mirroring it into state.
  const { html, error } = useMemo(() => {
    if (!encodedHtml) return { html: '', error: 'No preview content found in URL' };
    try {
      // Decode base64 URL-safe string (handle Unicode)
      const base64 = encodedHtml.replace(/-/g, '+').replace(/_/g, '/');
      const binaryString = atob(base64);
      const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);

      // Sanitize the decoded HTML
      const sanitized = sanitizeHtml(decoded);
      return sanitized.success
        ? { html: sanitized.result, error: '' }
        : { html: '', error: 'Failed to sanitize HTML: ' + sanitized.error };
    } catch (err) {
      return { html: '', error: 'Failed to load preview: ' + err.message };
    }
  }, [encodedHtml]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/html-preview')}
          sx={{ mb: 2 }}
        >
          Back to HTML Preview
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'tokens.rule', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.default' }}>
        <Button
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/html-preview')}
        >
          Back to Editor
        </Button>
        <Typography variant="body2" color="text.secondary">
          HTML Preview (Shareable)
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {html ? (
          <iframe
            srcDoc={html}
            title="Shared HTML Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'white'
            }}
            sandbox="allow-scripts"
          />
        ) : (
          <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>
            No content to display
          </Typography>
        )}
      </Box>
    </Box>
  );
}
