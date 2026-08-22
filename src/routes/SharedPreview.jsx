import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { sanitizeHtml } from '../lib/previewHtml';

export default function SharedPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const encodedHtml = searchParams.get('content');

      if (encodedHtml) {
        // Decode base64 URL-safe string (handle Unicode)
        const base64 = encodedHtml.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);

        // Sanitize the decoded HTML
        const sanitized = sanitizeHtml(decoded);
        if (sanitized.success) {
          setHtml(sanitized.result);
        } else {
          setError('Failed to sanitize HTML: ' + sanitized.error);
        }
      } else {
        setError('No preview content found in URL');
      }
    } catch (err) {
      setError('Failed to load preview: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading HTML preview...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
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
