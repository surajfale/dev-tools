import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Terminal } from '@mui/icons-material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';

SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);

import { FONT_MONO as CODE_FONT } from '../../theme';

/**
 * Prism palette derived from the Workbench tokens: ink for structure,
 * orange for keys/keywords, a muted green for strings, blue for numbers.
 * Every token colour clears 4.5:1 against its paper background.
 */
function workbenchPrism(t, isDark) {
  const c = {
    base: t.ink,
    comment: t.inkMuted,
    keyword: t.accentText,
    string: isDark ? '#9FD49A' : '#2F6B3A',
    number: isDark ? '#8AB4FF' : '#1F4FC4',
    punct: t.inkMuted,
  };
  return {
    'code[class*="language-"]': { color: c.base, background: 'none', fontFamily: CODE_FONT },
    'pre[class*="language-"]': { color: c.base, background: 'none' },
    comment: { color: c.comment, fontStyle: 'italic' },
    prolog: { color: c.comment },
    doctype: { color: c.comment },
    cdata: { color: c.comment },
    punctuation: { color: c.punct },
    property: { color: c.keyword, fontWeight: 600 },
    'attr-name': { color: c.keyword },
    tag: { color: c.base, fontWeight: 700 },
    keyword: { color: c.keyword, fontWeight: 700 },
    builtin: { color: c.keyword },
    function: { color: c.number },
    boolean: { color: c.number, fontWeight: 600 },
    number: { color: c.number },
    constant: { color: c.number },
    null: { color: c.number },
    string: { color: c.string },
    'attr-value': { color: c.string },
    char: { color: c.string },
    url: { color: c.number, textDecoration: 'underline' },
    operator: { color: c.base },
    title: { color: c.keyword, fontWeight: 700 },
    bold: { fontWeight: 700 },
    italic: { fontStyle: 'italic' },
  };
}

/**
 * Read-only, syntax-highlighted display for formatted/converted code output.
 * Mirrors the outlined TextField it replaces so layouts don't shift.
 */
export default function CodeBlock({ code, language, minRows = 12, placeholder, showLineNumbers = true }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const minHeight = `${minRows * 1.4375 + 2}em`;

  const wb = theme.palette.workbench;
  const containerSx = {
    border: 2,
    borderColor: 'text.primary',
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
          borderStyle: 'dashed',
          bgcolor: 'transparent',
          // Diagonal hatch = "nothing here yet", a drafting-table convention.
          backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 10px, ${wb.ruleSoft} 10px 11px)`,
        }}
      >
        <Terminal aria-hidden sx={{ fontSize: 28, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary" align="center" sx={{ bgcolor: 'background.default', px: 1 }}>
          {placeholder}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <SyntaxHighlighter
        language={language}
        style={workbenchPrism(wb, isDark)}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          minHeight,
          fontSize: '0.875rem',
          background: 'transparent',
          lineHeight: 1.6,
          overflowX: 'auto',
        }}
        codeTagProps={{ style: { fontFamily: CODE_FONT } }}
        lineNumberStyle={{ color: wb.inkMuted, minWidth: '2.5em', paddingRight: '1em', borderRight: `1px solid ${wb.ruleSoft}`, marginRight: '1em' }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}
