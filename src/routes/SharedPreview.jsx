import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { fetchHtmlFromUrl } from '../lib/uploadHtml';
import { sanitizeHtml } from '../lib/previewHtml';

export default function SharedPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHtml = async () => {
      try {
        // Check if content is from cloud (pastebin) or embedded in URL
        const cloudUrl = searchParams.get('cloud');
        const encodedHtml = searchParams.get('content');

        if (cloudUrl) {
          // Fetch from cloud service
          setLoading(true);
          const result = await fetchHtmlFromUrl(decodeURIComponent(cloudUrl));

          if (result.success) {
            // Sanitize the fetched HTML
            const sanitized = sanitizeHtml(result.html);
            if (sanitized.success) {
              setHtml(sanitized.result);
            } else {
              setError('Failed to sanitize HTML: ' + sanitized.error);
            }
          } else {
            setError('Failed to load HTML from cloud: ' + result.error);
          }
          setLoading(false);
        } else if (encodedHtml) {
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
          setLoading(false);
        } else {
          setError('No preview content found in URL');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load preview: ' + err.message);
        setLoading(false);
      }
    };

    loadHtml();
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
            sandbox="allow-same-origin allow-scripts"
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
