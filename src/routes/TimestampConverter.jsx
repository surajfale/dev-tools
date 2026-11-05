import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Clear, AccessTime, Refresh, ScienceOutlined } from '@mui/icons-material';
import { convertTimestamp, getCurrentTimestamp } from '../lib/convertTime';
import CopyButton from '../components/Common/CopyButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import ToolActionBar from '../components/Common/ToolActionBar';
import useStoredState from '../components/Common/useStoredState';
import useRevealOnPhone from '../components/Common/useRevealOnPhone';
import PageHeader from '../components/Common/PageHeader';

const sampleTimestamps = [
  '1640995200', // Unix seconds
  '1640995200000', // Unix milliseconds  
  '2022-01-01T00:00:00.000Z', // ISO string
];

export default function TimestampConverter() {
  const [input, setInput] = useStoredState('timestamp.input', '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [outputRef, revealOutput] = useRevealOnPhone();
  const [currentTime, setCurrentTime] = useState(getCurrentTimestamp);

  const handleConvert = useCallback(() => {
    const conversionResult = convertTimestamp(input);

    if (conversionResult.success) {
      setResult(conversionResult.result);
      setError('');
      revealOutput();
    } else {
      setError(conversionResult.error);
      setResult(null);
    }
  }, [input, revealOutput]);

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
  }, [handleConvert]);

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
      <PageHeader title="Timestamp Converter">
        Convert between Unix timestamps, ISO 8601, and human-readable formats.
      </PageHeader>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
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
          <ToolActionBar
            primary={{ label: 'Convert', icon: <AccessTime />, onClick: handleConvert, disabled: !input.trim() }}
            actions={[
              { label: 'Clear', icon: <Clear />, onClick: handleClear },
              { label: 'Now', ariaLabel: 'Use current time', icon: <Refresh />, onClick: handleNow, color: 'success' },
              { label: 'Sample', ariaLabel: 'Load sample input', icon: <ScienceOutlined />, onClick: handleLoadSample, color: 'secondary' },
            ]}
            onPaste={setInput}
          />

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

        <Grid size={{ xs: 12, md: 6 }} ref={outputRef} sx={{ scrollMarginTop: 64 }}>
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