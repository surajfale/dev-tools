import { useState, useEffect } from 'react';
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
import { formatJson } from '../lib/formatJson';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

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

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);

  const handleFormat = () => {
    const result = formatJson(input, { indent, minify, sortKeys });
    
    if (result.success) {
      setOutput(result.result);
      setError('');
    } else {
      setError(result.error);
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
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
  }, [input, indent, minify, sortKeys]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON Formatter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Format, validate, and beautify JSON data. Use Ctrl/Cmd+Enter to format quickly.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Indent Size</InputLabel>
              <Select
                value={indent}
                label="Indent Size"
                onChange={(e) => setIndent(e.target.value)}
              >
                <MenuItem value={2}>2 spaces</MenuItem>
                <MenuItem value={4}>4 spaces</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={minify}
                  onChange={(e) => setMinify(e.target.checked)}
                />
              }
              label="Minify"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                />
              }
              label="Sort Keys"
            />
          </Grid>
        </Grid>
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
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleLoadInvalid}
              aria-label="Load invalid JSON sample"
            >
              Invalid Sample
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Formatted Output
          </Typography>
          <TextField
            value={output}
            placeholder="Formatted JSON will appear here..."
            minRows={12}
            InputProps={{
              readOnly: true,
            }}
            aria-label="Formatted JSON output"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename="formatted.json" />
          </Stack>
        </Grid>
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}