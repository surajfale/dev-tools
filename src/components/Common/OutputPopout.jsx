import { Box, Button, Dialog, IconButton, Tooltip, Typography } from '@mui/material';
import { Close, OpenInFull } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import CodeBlock from './CodeBlock';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ErrorAlert from './ErrorAlert';
import { findTool } from '../Layout/toolRegistry';

const countLines = (text) => (text ? text.split('\n').length : 0);
const plural = (n, word) => `${n.toLocaleString()} ${word}${n === 1 ? '' : 'S'}`;
const byteSize = (text) => new Blob([text ?? '']).size;

/** Button that opens the full-screen output view. Disabled until there is output. */
export function PopoutButton({ onClick, disabled }) {
  return (
    <Tooltip title="Full screen">
      <span>
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInFull />}
          onClick={onClick}
          disabled={disabled}
          aria-label="Open output full screen"
        >
          Expand
        </Button>
      </span>
    </Tooltip>
  );
}

/**
 * Full-screen view of a tool's formatted output.
 *
 * Owns no formatting state: the parent passes the derived `code` and renders
 * its own option controls into `toolbar`, so changes made here and on the page
 * are the same state. Esc or the close button dismisses it; focus is trapped
 * inside while open and returns to the Expand button on close (MUI Dialog).
 */
export default function OutputPopout({ open, onClose, title, code, language, filename, toolbar, error }) {
  const { pathname } = useLocation();
  const tool = findTool(pathname);
  const titleId = 'output-popout-title';

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
          backgroundImage: (t) =>
            `linear-gradient(${t.palette.tokens.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.palette.tokens.grid} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        },
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: { xs: 1.5, md: 2.5 },
          px: { xs: 2, sm: 3 },
          py: 1.25,
          borderBottom: 1,
          borderColor: 'tokens.rule',
          bgcolor: 'background.default',
        }}
      >
        {/* Order on phones: title + close on row 1, options and actions wrap below,
            so Close is never pushed off-screen. Desktop keeps one row. */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: { xs: 1, md: '0 1 auto' } }}>
          {tool && (
            <Box
              component="span"
              sx={{ typography: 'overline', fontWeight: 600, px: 1, bgcolor: 'accent.main', color: 'accent.contrastText', lineHeight: 1.8 }}
            >
              T/{tool.code}
            </Box>
          )}
          <Typography id={titleId} variant="h6" component="h2" noWrap>
            {title}
          </Typography>
        </Box>

        {toolbar && (
          <Box
            role="group"
            aria-label="Output options"
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, flex: { md: 1 }, minWidth: 0, order: { xs: 2, md: 0 } }}
          >
            {toolbar}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
            ml: { md: 'auto' },
            order: { xs: 3, md: 0 },
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', mr: 1, whiteSpace: 'nowrap' }}>
            {plural(countLines(code), 'LINE')} · {byteSize(code).toLocaleString()} B
          </Typography>
          <CopyButton text={code} />
          <DownloadButton text={code} filename={filename} />
        </Box>

        <Tooltip title="Close (Esc)">
          <IconButton
            onClick={onClose}
            aria-label="Close full-screen view"
            sx={{ border: 1, borderColor: 'tokens.rule', order: { xs: 1, md: 0 }, flexShrink: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, p: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* An option change made here (e.g. SQL dialect) can fail; show why in place. */}
        {error && <ErrorAlert error={error} />}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <CodeBlock code={code} language={language} fill animate={false} placeholder="Nothing to show yet" />
        </Box>
      </Box>
    </Dialog>
  );
}
