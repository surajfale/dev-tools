import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Terminal } from '@mui/icons-material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);

const CODE_FONT = '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, Consolas, "Liberation Mono", monospace';

/**
 * Read-only, syntax-highlighted display for formatted/converted code output.
 * Mirrors the outlined TextField it replaces so layouts don't shift.
 */
export default function CodeBlock({ code, language, minRows = 12, placeholder, showLineNumbers = true }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const minHeight = `${minRows * 1.4375 + 2}em`;

  const containerSx = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    overflow: 'hidden',
    minHeight,
    bgcolor: 'background.paper',
  };

  if (!code) {
    return (
      <Box
        sx={{
          ...containerSx,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 3,
          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.015)',
        }}
      >
        <Terminal sx={{ fontSize: 28, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {placeholder}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          minHeight,
          fontSize: '0.875rem',
          background: 'transparent',
          overflowX: 'auto',
        }}
        codeTagProps={{ style: { fontFamily: CODE_FONT } }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}
