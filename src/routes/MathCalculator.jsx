import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import { Clear, Calculate } from '@mui/icons-material';
import { calculateSum, formatNumber } from '../lib/calculateSum';
import CopyButton from '../components/Common/CopyButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

const sampleNumbers = `10
20
30.5
45.75
100`;

export default function MathCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const calculation = calculateSum(input);

    if (calculation.success) {
      setResult(calculation.result);
      setError('');
    } else {
      setError(calculation.error);
      setResult(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const handleLoadSample = () => {
    setInput(sampleNumbers);
    setError('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Math Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Sum numbers separated by commas, spaces, or new lines. Supports decimals. Use Ctrl/Cmd+Enter to calculate quickly.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Input Numbers
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter numbers separated by comma, space, or new line..."
            minRows={15}
            aria-label="Number input"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Calculate />}
              onClick={handleCalculate}
              disabled={!input.trim()}
            >
              Calculate
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
            Results
          </Typography>

          {result ? (
            <Stack spacing={2}>
              <Card elevation={3} sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Sum
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
                    {formatNumber(result.sum)}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <CopyButton text={result.sum.toString()} />
                  </Stack>
                </CardContent>
              </Card>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Count
                      </Typography>
                      <Typography variant="h5" component="div">
                        {result.count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Average
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatNumber(result.average)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Minimum
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatNumber(result.min)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Maximum
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatNumber(result.max)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    All Numbers ({result.count})
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {result.numbers.map(n => formatNumber(n)).join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          ) : (
            <Box
              sx={{
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography color="text.secondary" align="center">
                Results will appear here...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}
