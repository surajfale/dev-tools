import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Stack
} from '@mui/material';
import { Clear, FormatAlignLeft } from '@mui/icons-material';
import { formatSql, sqlDialects } from '../lib/formatSql';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';
import CodeBlock from '../components/Common/CodeBlock';
import PageHeader from '../components/Common/PageHeader';
import OutputPopout, { PopoutButton } from '../components/Common/OutputPopout';

const sampleSql = `SELECT u.id, u.name, u.email, p.title as post_title, p.created_at FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.active = 1 AND p.published = true ORDER BY p.created_at DESC LIMIT 10;`;

/**
 * Dialect / Indent / Uppercase controls, rendered on the page and in the
 * full-screen popout against the same state. `idPrefix` keeps ids unique.
 */
function SqlOptions({ idPrefix, dialect, onDialect, indentSize, onIndentSize, uppercase, onUppercase }) {
  return (
    <>
      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id={`${idPrefix}-dialect-label`}>SQL Dialect</InputLabel>
        <Select labelId={`${idPrefix}-dialect-label`} value={dialect} label="SQL Dialect" onChange={(e) => onDialect(e.target.value)}>
          {sqlDialects.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id={`${idPrefix}-indent-label`}>Indent Size</InputLabel>
        <Select labelId={`${idPrefix}-indent-label`} value={indentSize} label="Indent Size" onChange={(e) => onIndentSize(e.target.value)}>
          <MenuItem value={2}>2 spaces</MenuItem>
          <MenuItem value={4}>4 spaces</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch checked={uppercase} onChange={(e) => onUppercase(e.target.checked)} />}
        label="Uppercase Keywords"
      />
    </>
  );
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  // The input behind the current result; output is derived from it so option
  // changes re-apply instantly on the page and in the popout.
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [uppercase, setUppercase] = useState(true);
  const [indentSize, setIndentSize] = useState(2);
  const [popoutOpen, setPopoutOpen] = useState(false);

  // Unlike JSON, a dialect switch can make previously-valid SQL unparseable,
  // so derivation keeps the error rather than silently showing nothing.
  const derived = useMemo(
    () => (source === null ? null : formatSql(source, { dialect, uppercase, indentSize })),
    [source, dialect, uppercase, indentSize],
  );
  const output = derived?.success ? derived.result : '';
  const shownError = error || (derived && !derived.success ? derived.error : '');

  const handleFormat = useCallback(() => {
    const result = formatSql(input, { dialect, uppercase, indentSize });

    if (result.success) {
      setSource(input);
      setError('');
    } else {
      setError(result.error);
      setSource(null);
    }
  }, [input, dialect, uppercase, indentSize]);

  const handleClear = () => {
    setInput('');
    setSource(null);
    setError('');
  };

  const handleLoadSample = () => {
    setInput(sampleSql);
    setError('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat]);

  const optionProps = {
    dialect,
    onDialect: setDialect,
    indentSize,
    onIndentSize: setIndentSize,
    uppercase,
    onUppercase: setUppercase,
  };

  return (
    <Box>
      <PageHeader title="SQL Formatter">
        Format and beautify SQL queries with support for multiple dialects. Options apply instantly to the current result.
      </PageHeader>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
        <SqlOptions idPrefix="page" {...optionProps} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Input SQL
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            minRows={12}
            aria-label="SQL input"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<FormatAlignLeft />}
              onClick={handleFormat}
              disabled={!input.trim()}
            >
              Format
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
            Formatted Output
          </Typography>
          <CodeBlock
            code={output}
            language="sql"
            minRows={12}
            placeholder="Formatted SQL will appear here..."
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename="formatted.sql" />
            <PopoutButton onClick={() => setPopoutOpen(true)} disabled={!output} />
          </Stack>
        </Grid>
      </Grid>

      <ErrorAlert error={shownError} />

      <OutputPopout
        open={popoutOpen}
        onClose={() => setPopoutOpen(false)}
        title="Formatted SQL"
        code={output}
        language="sql"
        filename="formatted.sql"
        toolbar={<SqlOptions idPrefix="popout" {...optionProps} />}
        error={shownError}
      />
    </Box>
  );
}