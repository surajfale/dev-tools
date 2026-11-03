import {
  DataObject,
  Storage,
  Schedule,
  Article,
  SwapHoriz,
  Visibility,
  Calculate,
} from '@mui/icons-material';

/**
 * Single source of truth for every tool: used by the sidebar index,
 * the dashboard grid, and each page's spec-sheet header.
 * `code` is the short tag rendered as a monospace label (T/01 …).
 */
export const tools = [
  {
    code: '01',
    tag: 'JSON',
    title: 'JSON Formatter',
    short: 'JSON Formatter',
    description: 'Format, validate, minify and key-sort JSON with readable error positions.',
    path: '/json-formatter',
    Icon: DataObject,
  },
  {
    code: '02',
    tag: 'SQL',
    title: 'SQL Formatter',
    short: 'SQL Formatter',
    description: 'Beautify queries across dialects — Postgres, MySQL, BigQuery, T-SQL and more.',
    path: '/sql-formatter',
    Icon: Storage,
  },
  {
    code: '03',
    tag: 'TIME',
    title: 'Timestamp Converter',
    short: 'Timestamps',
    description: 'Unix seconds, milliseconds, ISO 8601 and human dates — every zone at once.',
    path: '/timestamp-converter',
    Icon: Schedule,
  },
  {
    code: '04',
    tag: 'MD⇄HTML',
    title: 'Markdown ↔ HTML',
    short: 'Markdown ⇄ HTML',
    description: 'Two-way conversion with a sanitized live preview.',
    path: '/markdown-html',
    Icon: Article,
  },
  {
    code: '05',
    tag: 'JSON⇄YAML',
    title: 'JSON ↔ YAML',
    short: 'JSON ⇄ YAML',
    description: 'Bidirectional conversion with validation. Configs, manifests, CI files.',
    path: '/json-yaml',
    Icon: SwapHoriz,
  },
  {
    code: '06',
    tag: 'HTML',
    title: 'HTML Preview',
    short: 'HTML Preview',
    description: 'Render HTML in an isolated sandbox. Share via a URL that carries the content itself.',
    path: '/html-preview',
    Icon: Visibility,
  },
  {
    code: '07',
    tag: 'SUM',
    title: 'Math Calculator',
    short: 'Calculator',
    description: 'Paste a column of numbers, get sum, average, min, max and count.',
    path: '/math-calculator',
    Icon: Calculate,
  },
];

export function findTool(pathname) {
  return tools.find((t) => t.path === pathname);
}
