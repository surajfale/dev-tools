import { useState, useEffect, useCallback } from 'react';
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

const sampleSql = `SELECT u.id, u.name, u.email, p.title as post_title, p.created_at FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.active = 1 AND p.published = true ORDER BY p.created_at DESC LIMIT 10;`;

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [uppercase, setUppercase] = useState(true);
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = useCallback(() => {
    const result = formatSql(input, { dialect, uppercase, indentSize });

    if (result.success) {
      setOutput(result.result);
      setError('');
    } else {
      setError(result.error);
      setOutput('');
    }
  }, [input, dialect, uppercase, indentSize]);

  const handleClear = () => {
    setInput('');
    setOutput('');
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

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        SQL Formatter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Format and beautify SQL queries with support for multiple dialects. Use Ctrl/Cmd+Enter to format quickly.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>SQL Dialect</InputLabel>
              <Select
                value={dialect}
                label="SQL Dialect"
                onChange={(e) => setDialect(e.target.value)}
              >
                {sqlDialects.map((d) => (
                  <MenuItem key={d.value} value={d.value}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Indent Size</InputLabel>
              <Select
                value={indentSize}
                label="Indent Size"
                onChange={(e) => setIndentSize(e.target.value)}
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
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                />
              }
              label="Uppercase Keywords"
            />
          </Grid>
        </Grid>
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
          </Stack>
        </Grid>
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}