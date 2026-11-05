import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { Terminal } from '@mui/icons-material';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { FONT_MONO as CODE_FONT, bracketBackground } from '../../theme';
import { planReveal, prefersReducedMotion } from '../../lib/typewriter';
import { shouldTypeOutput } from '../../lib/settings';
import { useSettings } from './settingsContext';

SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);

const CARET = '▌';

/**
 * Prism palette derived from the Mission Control tokens: amber for
 * keys/keywords, green for strings, blue for numbers and literals.
 * Every token colour clears 4.5:1 against the panel surface.
 */
function missionPrism(t) {
  const c = { base: t.ink, comment: t.inkMuted, keyword: t.accentText, string: t.codeString, number: t.codeNumber, punct: t.inkMuted };
  return {
    'code[class*="language-"]': { color: c.base, background: 'none', fontFamily: CODE_FONT },
    'pre[class*="language-"]': { color: c.base, background: 'none' },
    comment: { color: c.comment, fontStyle: 'italic' },
    prolog: { color: c.comment },
    doctype: { color: c.comment },
    cdata: { color: c.comment },
    punctuation: { color: c.punct },
    property: { color: c.keyword },
    'attr-name': { color: c.keyword },
    tag: { color: c.base, fontWeight: 600 },
    keyword: { color: c.keyword, fontWeight: 600 },
    builtin: { color: c.keyword },
    function: { color: c.number },
    boolean: { color: c.number },
    number: { color: c.number },
    constant: { color: c.number },
    null: { color: c.number },
    string: { color: c.string },
    'attr-value': { color: c.string },
    char: { color: c.string },
    url: { color: c.number, textDecoration: 'underline' },
    operator: { color: c.base },
    title: { color: c.keyword, fontWeight: 600 },
    bold: { fontWeight: 700 },
    italic: { fontStyle: 'italic' },
  };
}

/**
 * Reveals new output line by line, like a terminal printing it. The first
 * value shown on mount is not animated, outputs over the cap appear at once
 * (see planReveal), and `enabled` (from the user's typing setting) can turn
 * it off entirely. Switching it off mid-reveal shows the full output.
 */
function useTypingReveal(code, enabled) {
  const [shown, setShown] = useState(code);
  const previousRef = useRef(code);

  useEffect(() => {
    const changed = code !== previousRef.current;
    previousRef.current = code;
    const lines = code ? code.split('\n') : [];
    const plan = changed && code && enabled ? planReveal(lines.length) : null;

    if (!plan) {
      setShown(code);
      return undefined;
    }

    let count = 0;
    setShown('');
    const id = setInterval(() => {
      count += plan.linesPerTick;
      if (count >= lines.length) {
        clearInterval(id);
        setShown(code);
      } else {
        setShown(lines.slice(0, count).join('\n'));
      }
    }, plan.interval);
    return () => clearInterval(id);
  }, [code, enabled]);

  return { shown, typing: Boolean(code) && shown !== code };
}

/**
 * Read-only, syntax-highlighted display for formatted/converted code output.
 * Mirrors the outlined TextField it sits next to so layouts don't shift.
 *
 * - `fill`: grow to the parent's height and scroll inside (used by OutputPopout)
 * - `animate`: set false where a code change is a view toggle rather than a
 *   new result, so it never replays the typing reveal
 */
export default function CodeBlock({
  code,
  language,
  minRows = 12,
  placeholder,
  showLineNumbers = true,
  fill = false,
  animate = true,
}) {
  const theme = useTheme();
  const t = theme.palette.tokens;
  const minHeight = fill ? '100%' : `${minRows * 1.4375 + 2}em`;
  const { settings } = useSettings();
  const { shown, typing } = useTypingReveal(
    code,
    animate && shouldTypeOutput(settings.typing, prefersReducedMotion()),
  );

  const containerSx = {
    border: 1,
    borderColor: 'divider',
    overflow: fill ? 'auto' : 'hidden',
    minHeight,
    ...(fill && { height: '100%' }),
    background: bracketBackground(t.accentText, t.paper),
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
          background: 'transparent',
        }}
      >
        <Terminal aria-hidden sx={{ fontSize: 26, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary" align="center">
          {placeholder}
        </Typography>
        <Typography variant="caption" sx={{ color: 'secondary.main', fontSize: '0.7rem', letterSpacing: '0.12em' }}>
          AWAITING INPUT
          <Box component="span" aria-hidden sx={{ animation: 'mc-blink 1s steps(1) infinite', ml: 0.5 }}>
            {CARET}
          </Box>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={containerSx} aria-busy={typing}>
      <SyntaxHighlighter
        language={language}
        style={missionPrism(t)}
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
        lineNumberStyle={{
          color: t.inkMuted,
          minWidth: '2.5em',
          paddingRight: '1em',
          borderRight: `1px solid ${t.ruleSoft}`,
          marginRight: '1em',
        }}
      >
        {typing ? `${shown}${shown ? ' ' : ''}${CARET}` : shown}
      </SyntaxHighlighter>
    </Box>
  );
}
