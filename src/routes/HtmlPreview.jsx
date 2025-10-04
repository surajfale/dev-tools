import { useState, useEffect } from 'react';
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
import { Clear, Visibility, Code as CodeIcon, Share, OpenInNew, CloudUpload } from '@mui/icons-material';
import { sanitizeHtml } from '../lib/previewHtml';
import { minifyHtml, calculateCompression } from '../lib/minifyHtml';
import { uploadHtmlToCloud } from '../lib/uploadHtml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

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
  const [input, setInput] = useState('');
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [shareableUrl, setShareableUrl] = useState('');
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudService, setCloudService] = useState('');
  const [cloudExpiration, setCloudExpiration] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handlePreview = () => {
    const result = sanitizeHtml(input);

    if (result.success) {
      setSanitizedHtml(result.result);
      setError('');
      setActiveTab(1); // Switch to preview tab
      // Clear previous shareable URL and stats
      setShareableUrl('');
      setCompressionStats(null);
      setCloudUrl('');
      setCloudService('');
      setCloudExpiration('');
    } else {
      setError(result.error);
      setSanitizedHtml('');
      setShareableUrl('');
      setCompressionStats(null);
      setCloudUrl('');
      setCloudService('');
      setCloudExpiration('');
    }
  };

  const handleClear = () => {
    setInput('');
    setSanitizedHtml('');
    setError('');
    setActiveTab(0);
    setShareableUrl('');
    setCompressionStats(null);
    setCloudUrl('');
    setCloudService('');
    setCloudExpiration('');
  };

  const handleLoadSample = () => {
    setInput(sampleHtml);
    setError('');
  };

  const generateShareableUrl = () => {
    if (sanitizedHtml) {
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
        if (url.length > 8000) {
          return null; // Too long for URL
        }

        setShareableUrl(url);
        return url;
      } catch (err) {
        console.error('Error generating shareable URL:', err);
        return null;
      }
    }
    return '';
  };

  const handleOpenInNewTab = () => {
    const url = generateShareableUrl();
    if (url) {
      window.open(url, '_blank');
    } else if (sanitizedHtml) {
      // Fallback: Open in new window without shareable URL (for large HTML)
      const newWindow = window.open('', '_blank');
      newWindow.document.write(sanitizedHtml);
      newWindow.document.close();

      // Show info instead of error - this is expected behavior for large files
      setError('');
      setShowCopyAlert(false);
    }
  };

  const handleCopyShareableLink = async () => {
    const url = generateShareableUrl();
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
      const encodedLength = compressionStats?.minifiedSize ?
        Math.ceil(compressionStats.minifiedSize * 1.37) : // Base64 is ~37% larger
        'unknown';
      setError(`HTML content too large for shareable link even after ${compressionStats?.reduction || 0}% compression (estimated URL: ${encodedLength} chars, max: 8000). Try "Upload & Share" instead for large files.`);
    }
  };

  const handleUploadToCloud = async () => {
    if (!sanitizedHtml) return;

    setIsUploading(true);
    setError('');
    setCloudUrl(''); // Clear previous cloud URL
    setCloudExpiration('');

    try {
      const result = await uploadHtmlToCloud(sanitizedHtml);

      if (result.success) {
        // Create our preview URL that will fetch from the cloud service
        const previewUrl = `${window.location.origin}/preview?cloud=${encodeURIComponent(result.viewUrl)}`;
        setCloudUrl(previewUrl);
        setCloudService(result.service || 'cloud');
        setCloudExpiration(result.expiration || 'unknown');

        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(previewUrl);
          setShowCopyAlert(true);
        } catch (clipErr) {
          console.warn('Clipboard copy failed:', clipErr);
          // Still show success even if clipboard fails
        }
      } else {
        setError(result.error || 'Upload failed. Please try again or use the Download button to save your HTML file.');
      }
    } catch (err) {
      setError('Failed to upload HTML: ' + err.message + '. Please try again later.');
    } finally {
      setIsUploading(false);
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
  }, [input]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        HTML Preview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Paste HTML code and see it rendered live. For small files, shareable links are automatically minified. For large files, use "Upload & Share" to get a shareable link. Use Ctrl/Cmd+Enter to preview quickly.
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>⚠️ Privacy Notice:</strong> Do not upload sensitive or personal information.
          Uploaded content is stored on third-party services and will be automatically deleted after 7 days.
          Only share publicly viewable content like presentations, portfolios, or demos.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={handlePreview}
              disabled={!input.trim()}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
            >
              Clear
            </Button>
            <SampleInputButton onLoadSample={handleLoadSample} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
              <Tab label="Preview" icon={<Visibility />} iconPosition="start" />
              <Tab label="Sanitized HTML" icon={<CodeIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box>
              <Paper
                elevation={1}
                sx={{
                  minHeight: 400,
                  border: '1px solid',
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
                    sandbox="allow-same-origin allow-scripts"
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
                      disabled={isUploading}
                    >
                      Copy Shareable Link
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CloudUpload />}
                      onClick={handleUploadToCloud}
                      disabled={isUploading}
                      aria-label="Upload to cloud and get shareable link"
                    >
                      {isUploading ? 'Uploading...' : 'Upload & Share'}
                    </Button>
                  </Stack>
                  {cloudUrl && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="caption" display="block">
                        <strong>✓ Uploaded to {cloudService}!</strong>
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1, wordBreak: 'break-all' }}>
                        Shareable link (copied to clipboard): <br />
                        <strong>{cloudUrl}</strong>
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        {cloudExpiration === 'permanent'
                          ? '⚠️ Link is permanent - will not auto-delete'
                          : `🗑️ Link expires in ${cloudExpiration}`
                        }
                      </Typography>
                    </Alert>
                  )}
                  {compressionStats && shareableUrl && !cloudUrl && (
                    <Alert severity={shareableUrl.length > 8000 ? "warning" : "info"} sx={{ mt: 2 }}>
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
                        {shareableUrl.length > 8000 ? ' ⚠️ Too long - use "Upload & Share" instead' : ' ✓ Ready to share'}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <TextField
                value={sanitizedHtml}
                placeholder="Sanitized HTML will appear here..."
                minRows={20}
                InputProps={{
                  readOnly: true,
                }}
                aria-label="Sanitized HTML output"
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
