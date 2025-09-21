import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Clear, AccessTime, Refresh } from '@mui/icons-material';
import { convertTimestamp, getCurrentTimestamp } from '../lib/convertTime';
import CopyButton from '../components/Common/CopyButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

const sampleTimestamps = [
  '1640995200', // Unix seconds
  '1640995200000', // Unix milliseconds  
  '2022-01-01T00:00:00.000Z', // ISO string
];

export default function TimestampConverter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp());

  const handleConvert = () => {
    const conversionResult = convertTimestamp(input);
    
    if (conversionResult.success) {
      setResult(conversionResult.result);
      setError('');
    } else {
      setError(conversionResult.error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const handleNow = () => {
    const now = getCurrentTimestamp();
    setInput(now.unixSeconds.toString());
    setCurrentTime(now);
    setError('');
  };

  const handleLoadSample = () => {
    const randomSample = sampleTimestamps[Math.floor(Math.random() * sampleTimestamps.length)];
    setInput(randomSample);
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
  }, [input]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimestamp());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatRow = (label, value, copyValue = value) => (
    <TableRow>
      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
        {label}
      </TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>
        <CopyButton text={copyValue?.toString()} size="small" />
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Timestamp Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between Unix timestamps, ISO 8601, and human-readable formats. 
        Use Ctrl/Cmd+Enter to convert quickly.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Input Timestamp
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Unix seconds, milliseconds, or ISO string..."
            minRows={3}
            aria-label="Timestamp input"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AccessTime />}
              onClick={handleConvert}
              disabled={!input.trim()}
            >
              Convert
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleNow}
              color="success"
            >
              Now
            </Button>
            <SampleInputButton onLoadSample={handleLoadSample} />
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Time (Live)
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Format</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formatRow('Unix Seconds', currentTime.unixSeconds)}
                  {formatRow('Unix Milliseconds', currentTime.unixMilliseconds)}
                  {formatRow('ISO 8601', currentTime.iso8601)}
                  {formatRow('Local Time', currentTime.localTime)}
                  {formatRow('UTC Time', currentTime.utcTime)}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Conversion Result
          </Typography>
          {result ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Format</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formatRow('Input Type', result.inputType.replace('_', ' ').toUpperCase(), null)}
                  {formatRow('Unix Seconds', result.unixSeconds)}
                  {formatRow('Unix Milliseconds', result.unixMilliseconds)}
                  {formatRow('ISO 8601', result.iso8601)}
                  {formatRow('Local Time', result.localTime)}
                  {formatRow('UTC Time', result.utcTime)}
                  {formatRow('Relative Time', result.relativeTime, null)}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper 
              variant="outlined" 
              sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
            >
              Conversion result will appear here...
            </Paper>
          )}
        </Grid>
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}