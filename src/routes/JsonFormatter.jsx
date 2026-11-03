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
  Stack,
} from '@mui/material';
import { Clear, FormatAlignLeft } from '@mui/icons-material';
import { formatJson } from '../lib/formatJson';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';
import CodeBlock from '../components/Common/CodeBlock';
import PageHeader from '../components/Common/PageHeader';
import OutputPopout, { PopoutButton } from '../components/Common/OutputPopout';

const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "coding", "traveling"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  }
}`;

const invalidJson = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
  "missing": "comma"
}`;

/**
 * Indent / Minify / Sort keys controls. Rendered both on the page and in the
 * full-screen popout, bound to the same state, so the two always agree.
 * `idPrefix` keeps label/control ids unique when both are mounted at once.
 */
function JsonOptions({ idPrefix, indent, onIndent, minify, onMinify, sortKeys, onSortKeys }) {
  return (
    <>
      <FormControl size="small" sx={{ minWidth: 150 }} disabled={minify}>
        <InputLabel id={`${idPrefix}-indent-label`}>Indent Size</InputLabel>
        <Select
          labelId={`${idPrefix}-indent-label`}
          value={indent}
          label="Indent Size"
          onChange={(e) => onIndent(e.target.value)}
        >
          <MenuItem value={2}>2 spaces</MenuItem>
          <MenuItem value={4}>4 spaces</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch checked={minify} onChange={(e) => onMinify(e.target.checked)} />}
        label="Minify"
      />
      <FormControlLabel
        control={<Switch checked={sortKeys} onChange={(e) => onSortKeys(e.target.checked)} />}
        label="Sort Keys"
      />
    </>
  );
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  // The input that produced the current result. Output is derived from it, so
  // option changes (sort, minify, indent) re-apply instantly, and turning Sort
  // off restores the original key order instead of re-formatting sorted output.
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const [popoutOpen, setPopoutOpen] = useState(false);

  const output = useMemo(() => {
    if (source === null) return '';
    const result = formatJson(source, { indent, minify, sortKeys });
    return result.success ? result.result : '';
  }, [source, indent, minify, sortKeys]);

  const handleFormat = useCallback(() => {
    const result = formatJson(input, { indent, minify, sortKeys });

    if (result.success) {
      setSource(input);
      setError('');
    } else {
      setError(result.error);
      setSource(null);
    }
  }, [input, indent, minify, sortKeys]);

  const handleClear = () => {
    setInput('');
    setSource(null);
    setError('');
  };

  const handleLoadSample = () => {
    setInput(sampleJson);
    setError('');
  };

  const handleLoadInvalid = () => {
    setInput(invalidJson);
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
    indent,
    onIndent: setIndent,
    minify,
    onMinify: setMinify,
    sortKeys,
    onSortKeys: setSortKeys,
  };

  return (
    <Box>
      <PageHeader title="JSON Formatter">
        Format, validate, and beautify JSON data. Options apply instantly to the current result.
      </PageHeader>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
        <JsonOptions idPrefix="page" {...optionProps} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Input JSON
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            minRows={12}
            aria-label="JSON input"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            <Button variant="contained" startIcon={<FormatAlignLeft />} onClick={handleFormat} disabled={!input.trim()}>
              Format
            </Button>
            <Button variant="outlined" startIcon={<Clear />} onClick={handleClear}>
              Clear
            </Button>
            <SampleInputButton onLoadSample={handleLoadSample} />
            <Button size="small" variant="outlined" color="error" onClick={handleLoadInvalid} aria-label="Load invalid JSON sample">
              Invalid Sample
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Formatted Output
          </Typography>
          <CodeBlock code={output} language="json" minRows={12} placeholder="Formatted JSON will appear here..." />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename="formatted.json" />
            <PopoutButton onClick={() => setPopoutOpen(true)} disabled={!output} />
          </Stack>
        </Grid>
      </Grid>

      <ErrorAlert error={error} />

      <OutputPopout
        open={popoutOpen}
        onClose={() => setPopoutOpen(false)}
        title="Formatted JSON"
        code={output}
        language="json"
        filename="formatted.json"
        toolbar={<JsonOptions idPrefix="popout" {...optionProps} />}
        error={error}
      />
    </Box>
  );
}
