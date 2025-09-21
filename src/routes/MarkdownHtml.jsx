import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider
} from '@mui/material';
import { Clear, Transform, Visibility } from '@mui/icons-material';
import { convertMarkdownToHtml, convertHtmlToMarkdown } from '../lib/convertMarkdownHtml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

const sampleMarkdown = `# Sample Markdown Document

This is a **bold** text and this is *italic* text.

## Code Example

Here's some inline \`code\` and a code block:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item

## Links and Images

[Visit our website](https://example.com)

![Sample Image](https://via.placeholder.com/150x100?text=Sample)

## Table

| Feature | Status |
|---------|--------|
| JSON Formatter | ✅ Done |
| SQL Formatter | ✅ Done |
| Markdown | 🚧 In Progress |
`;

const sampleHtml = `<h1>Sample HTML Document</h1>
<p>This is a <strong>bold</strong> text and this is <em>italic</em> text.</p>
<h2>Code Example</h2>
<p>Here's some inline <code>code</code> and a code block:</p>
<pre><code>function greet(name) {
  console.log(\`Hello, \${name}!\`);
}</code></pre>
<h2>Lists</h2>
<ul>
<li>Item 1</li>
<li>Item 2
<ul>
<li>Nested item</li>
<li>Another nested item</li>
</ul>
</li>
</ul>`;

export default function MarkdownHtml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('md-to-html');

  const handleConvert = () => {
    let result;
    
    if (direction === 'md-to-html') {
      result = convertMarkdownToHtml(input);
    } else {
      result = convertHtmlToMarkdown(input);
    }
    
    if (result.success) {
      setOutput(result.result);
      setError('');
      
      // Set preview for markdown to HTML conversion
      if (direction === 'md-to-html') {
        setPreview(result.result);
      } else {
        setPreview('');
      }
    } else {
      setError(result.error);
      setOutput('');
      setPreview('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setPreview('');
    setError('');
  };

  const handleLoadSample = () => {
    if (direction === 'md-to-html') {
      setInput(sampleMarkdown);
    } else {
      setInput(sampleHtml);
    }
    setError('');
  };

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setInput('');
    setOutput('');
    setPreview('');
    setError('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleConvert();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [input, direction]);

  const isMarkdownToHtml = direction === 'md-to-html';
  const inputLabel = isMarkdownToHtml ? 'Markdown Input' : 'HTML Input';
  const outputLabel = isMarkdownToHtml ? 'HTML Output' : 'Markdown Output';
  const fileExtension = isMarkdownToHtml ? 'html' : 'md';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Markdown ↔ HTML Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between Markdown and HTML formats with live preview. 
        Use Ctrl/Cmd+Enter to convert quickly.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Conversion Direction</InputLabel>
          <Select
            value={direction}
            label="Conversion Direction"
            onChange={(e) => handleDirectionChange(e.target.value)}
          >
            <MenuItem value="md-to-html">Markdown → HTML</MenuItem>
            <MenuItem value="html-to-md">HTML → Markdown</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {inputLabel}
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${isMarkdownToHtml ? 'Markdown' : 'HTML'} here...`}
            minRows={12}
            aria-label={inputLabel}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Transform />}
              onClick={handleConvert}
              disabled={!input.trim()}
            >
              Convert
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
          <Typography variant="h6" gutterBottom>
            {outputLabel}
          </Typography>
          <TextField
            value={output}
            placeholder={`${isMarkdownToHtml ? 'HTML' : 'Markdown'} output will appear here...`}
            minRows={12}
            InputProps={{
              readOnly: true,
            }}
            aria-label={outputLabel}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename={`converted.${fileExtension}`} />
          </Stack>
        </Grid>

        {isMarkdownToHtml && preview && (
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Visibility sx={{ mr: 1 }} />
              <Typography variant="h6">
                Live Preview
              </Typography>
            </Box>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                '& > *:first-of-type': { mt: 0 },
                '& > *:last-child': { mb: 0 }
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: preview }}
                style={{
                  lineHeight: 1.6,
                  fontFamily: 'inherit'
                }}
              />
            </Paper>
          </Grid>
        )}
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}