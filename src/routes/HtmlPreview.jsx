import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  Paper,
  Tab,
  Tabs,
  Snackbar,
  Alert
} from '@mui/material';
import { Clear, Visibility, Code as CodeIcon, Share, OpenInNew, ScienceOutlined } from '@mui/icons-material';
import { sanitizeHtml } from '../lib/previewHtml';
import { minifyHtml, calculateCompression } from '../lib/minifyHtml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import ToolActionBar from '../components/Common/ToolActionBar';
import useStoredState from '../components/Common/useStoredState';
import useRevealOnPhone from '../components/Common/useRevealOnPhone';
import CodeBlock from '../components/Common/CodeBlock';
import PageHeader from '../components/Common/PageHeader';

const MAX_URL_LENGTH = 8000;

const sampleHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #2196f3; }
    .card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      background: #f5f5f5;
    }
    button {
      background: #2196f3;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover { background: #1976d2; }
  </style>
</head>
<body>
  <h1>Welcome to HTML Preview</h1>
  <div class="card">
    <h2>Interactive Elements</h2>
    <p>This is a sample HTML page with styles and interactive elements.</p>
    <button onclick="alert('Hello from HTML Preview!')">Click Me</button>
  </div>
  <div class="card">
    <h3>Features:</h3>
    <ul>
      <li>Live HTML rendering</li>
      <li>CSS styling support</li>
      <li>JavaScript execution</li>
      <li>Secure sanitization</li>
    </ul>
  </div>
</body>
</html>`;

export default function HtmlPreview() {
  const [input, setInput] = useStoredState('htmlpreview.input', '');
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  const [error, setError] = useState('');
  const [outputRef, revealOutput] = useRevealOnPhone();
  const [activeTab, setActiveTab] = useState(0);
  const [shareableUrl, setShareableUrl] = useState('');
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);

  const handlePreview = useCallback(() => {
    const result = sanitizeHtml(input);

    if (result.success) {
      setSanitizedHtml(result.result);
      setError('');
      revealOutput();
      setActiveTab(0); // Switch to preview tab
      // Clear previous shareable URL and stats
      setShareableUrl('');
      setCompressionStats(null);
    } else {
      setError(result.error);
      setSanitizedHtml('');
      setShareableUrl('');
      setCompressionStats(null);
    }
  }, [input, revealOutput]);

  const handleClear = () => {
    setInput('');
    setSanitizedHtml('');
    setError('');
    setActiveTab(0);
    setShareableUrl('');
    setCompressionStats(null);
  };

  const handleLoadSample = () => {
    setInput(sampleHtml);
    setError('');
  };

  // Returns { url, stats }; url is null when the link would exceed the URL budget.
  // Stats are returned (not only stored) so the same click can report them,
  // before the setState round-trip lands.
  const generateShareableUrl = () => {
    if (!sanitizedHtml) return { url: null, stats: null };
    try {
      // Minify HTML to reduce size
      const minified = minifyHtml(sanitizedHtml);
      const stats = calculateCompression(sanitizedHtml, minified);
      setCompressionStats(stats);

      // Encode minified HTML to base64 URL-safe format (handle Unicode)
      const utf8Bytes = new TextEncoder().encode(minified);
      const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
      const encoded = btoa(binaryString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const url = `${window.location.origin}/preview?content=${encoded}`;

      // Check URL length (browsers typically limit to 2000-8000 chars)
      if (url.length > MAX_URL_LENGTH) {
        return { url: null, stats };
      }

      setShareableUrl(url);
      return { url, stats };
    } catch (err) {
      console.error('Error generating shareable URL:', err);
      return { url: null, stats: null };
    }
  };

  const tooLargeMessage = (stats) => {
    const estimated = stats?.minifiedSize
      ? Math.ceil(stats.minifiedSize * 1.37) // Base64 is ~37% larger
      : 'unknown';
    return `HTML content too large for a shareable link even after ${stats?.reduction || 0}% compression (estimated URL: ${estimated} chars, max: ${MAX_URL_LENGTH}). Use the Download button instead for large files.`;
  };

  const handleOpenInNewTab = () => {
    if (!sanitizedHtml) return;
    const { url, stats } = generateShareableUrl();
    if (url) {
      // The /preview route renders the content inside a sandboxed iframe.
      window.open(url, '_blank', 'noopener');
      setError('');
    } else {
      // Deliberately no document.write() fallback: an about:blank window inherits
      // this app's origin, so previewed scripts would run unsandboxed with access
      // to our storage and service-worker cache.
      setError(tooLargeMessage(stats));
    }
  };

  const handleCopyShareableLink = async () => {
    const { url, stats } = generateShareableUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setShowCopyAlert(true);
        setError('');
      } catch (err) {
        console.error('Failed to copy:', err);
        setError('Failed to copy link to clipboard');
      }
    } else {
      setError(tooLargeMessage(stats));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handlePreview();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePreview]);

  return (
    <Box>
      <PageHeader title="HTML Preview">
        Paste HTML code and see it rendered live. Shareable links encode the (minified) HTML directly in the URL — nothing is ever uploaded anywhere.
      </PageHeader>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Privacy:</strong> Everything on this page runs entirely in your browser. Your HTML is never sent to a server, uploaded, or stored anywhere — including &quot;shareable&quot; links, which embed the content directly in the URL itself. Anyone you share a link with can see its content, so avoid pasting sensitive or personal information.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            HTML Input
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            minRows={20}
            aria-label="HTML input"
          />
          <ToolActionBar
            primary={{ label: 'Preview', icon: <Visibility />, onClick: handlePreview, disabled: !input.trim() }}
            actions={[
              { label: 'Clear', icon: <Clear />, onClick: handleClear },
              { label: 'Sample', ariaLabel: 'Load sample input', icon: <ScienceOutlined />, onClick: handleLoadSample, color: 'secondary' },
            ]}
            onPaste={setInput}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} ref={outputRef} sx={{ scrollMarginTop: 64 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
              <Tab label="Preview" icon={<Visibility />} iconPosition="start" />
              <Tab label="Sanitized HTML" icon={<CodeIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  minHeight: 400,
                  border: 1,
                  borderColor: 'divider',
                  overflow: 'hidden'
                }}
              >
                {sanitizedHtml ? (
                  <iframe
                    srcDoc={sanitizedHtml}
                    title="HTML Preview"
                    style={{
                      width: '100%',
                      minHeight: '400px',
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                    sandbox="allow-scripts"
                  />
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ p: 2, mt: 20 }}>
                    Preview will appear here...
                  </Typography>
                )}
              </Paper>
              {sanitizedHtml && (
                <Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<OpenInNew />}
                      onClick={handleOpenInNewTab}
                      aria-label="Open preview in new tab"
                    >
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleCopyShareableLink}
                      aria-label="Copy shareable link"
                    >
                      Copy Shareable Link
                    </Button>
                  </Stack>
                  {compressionStats && shareableUrl && (
                    <Alert severity={shareableUrl.length > MAX_URL_LENGTH ? "warning" : "info"} sx={{ mt: 2 }}>
                      <Typography variant="caption" display="block">
                        <strong>Automatic Compression Applied:</strong>
                      </Typography>
                      <Typography variant="caption" display="block">
                        Original: {compressionStats.originalSize.toLocaleString()} bytes →
                        Minified: {compressionStats.minifiedSize.toLocaleString()} bytes
                        ({compressionStats.reduction}% smaller)
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Final URL length: {shareableUrl.length.toLocaleString()}/8,000 chars
                        {shareableUrl.length > MAX_URL_LENGTH ? ' ⚠️ Too long - use the Download button instead' : ' ✓ Ready to share'}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <CodeBlock
                code={sanitizedHtml}
                language="markup"
                minRows={20}
                placeholder="Sanitized HTML will appear here..."
              />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <CopyButton text={sanitizedHtml} />
                <DownloadButton text={sanitizedHtml} filename="preview.html" />
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>

      <ErrorAlert error={error} />

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowCopyAlert(false)} severity="success">
          Shareable link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
