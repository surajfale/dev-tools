import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider
} from '@mui/material';
import { Clear, Transform, Visibility, ScienceOutlined } from '@mui/icons-material';
import { convertMarkdownToHtml, convertHtmlToMarkdown } from '../lib/convertMarkdownHtml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import ToolActionBar from '../components/Common/ToolActionBar';
import useStoredState from '../components/Common/useStoredState';
import useRevealOnPhone from '../components/Common/useRevealOnPhone';
import CodeBlock from '../components/Common/CodeBlock';
import PageHeader from '../components/Common/PageHeader';

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

![Sample Image](data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='150'%20height='100'%3E%3Crect%20width='150'%20height='100'%20fill='%23FFB020'/%3E%3Ctext%20x='75'%20y='56'%20font-family='monospace'%20font-size='14'%20text-anchor='middle'%3ESAMPLE%3C/text%3E%3C/svg%3E)

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

const DIRECTIONS = ['md-to-html', 'html-to-md'];
const isDirection = (v) => DIRECTIONS.includes(v);

export default function MarkdownHtml() {
  const [input, setInput] = useStoredState('markdown.input', '');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [outputRef, revealOutput] = useRevealOnPhone();
  const [direction, setDirection] = useStoredState('markdown.direction', 'md-to-html', isDirection);

  const handleConvert = useCallback(() => {
    let result;

    if (direction === 'md-to-html') {
      result = convertMarkdownToHtml(input);
    } else {
      result = convertHtmlToMarkdown(input);
    }

    if (result.success) {
      setOutput(result.result);
      setError('');
      revealOutput();

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
  }, [input, direction, revealOutput]);

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
  }, [handleConvert]);

  const isMarkdownToHtml = direction === 'md-to-html';
  const inputLabel = isMarkdownToHtml ? 'Markdown Input' : 'HTML Input';
  const outputLabel = isMarkdownToHtml ? 'HTML Output' : 'Markdown Output';
  const fileExtension = isMarkdownToHtml ? 'html' : 'md';

  return (
    <Box>
      <PageHeader title="Markdown ↔ HTML Converter">
        Convert between Markdown and HTML formats with live preview.
      </PageHeader>

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
        <Grid size={{ xs: 12, md: 6 }}>
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
          <ToolActionBar
            primary={{ label: 'Convert', icon: <Transform />, onClick: handleConvert, disabled: !input.trim() }}
            actions={[
              { label: 'Clear', icon: <Clear />, onClick: handleClear },
              { label: 'Sample', ariaLabel: 'Load sample input', icon: <ScienceOutlined />, onClick: handleLoadSample, color: 'secondary' },
            ]}
            onPaste={setInput}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} ref={outputRef} sx={{ scrollMarginTop: 64 }}>
          <Typography variant="h6" gutterBottom>
            {outputLabel}
          </Typography>
          <CodeBlock
            code={output}
            language={isMarkdownToHtml ? 'markup' : 'markdown'}
            minRows={12}
            placeholder={`${isMarkdownToHtml ? 'HTML' : 'Markdown'} output will appear here...`}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename={`converted.${fileExtension}`} />
          </Stack>
        </Grid>

        {isMarkdownToHtml && preview && (
          <Grid size={12}>
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
                // `preview` is DOMPurify output (default config) from convertMarkdownToHtml
                // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
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