import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import { Clear, Calculate, ScienceOutlined } from '@mui/icons-material';
import { calculateSum, formatNumber } from '../lib/calculateSum';
import CopyButton from '../components/Common/CopyButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import ToolActionBar from '../components/Common/ToolActionBar';
import useStoredState from '../components/Common/useStoredState';
import useRevealOnPhone from '../components/Common/useRevealOnPhone';
import PageHeader from '../components/Common/PageHeader';

const sampleNumbers = `10
20
30.5
45.75
100`;

export default function MathCalculator() {
  const [input, setInput] = useStoredState('math.input', '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [outputRef, revealOutput] = useRevealOnPhone();

  const handleCalculate = useCallback(() => {
    const calculation = calculateSum(input);

    if (calculation.success) {
      setResult(calculation.result);
      setError('');
      revealOutput();
    } else {
      setError(calculation.error);
      setResult(null);
    }
  }, [input, revealOutput]);

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
  }, [handleCalculate]);

  return (
    <Box>
      <PageHeader title="Math Calculator">
        Sum numbers separated by commas, spaces, or new lines. Supports decimals.
      </PageHeader>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
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
          <ToolActionBar
            primary={{ label: 'Calculate', icon: <Calculate />, onClick: handleCalculate, disabled: !input.trim() }}
            actions={[
              { label: 'Clear', icon: <Clear />, onClick: handleClear },
              { label: 'Sample', ariaLabel: 'Load sample input', icon: <ScienceOutlined />, onClick: handleLoadSample, color: 'secondary' },
            ]}
            onPaste={setInput}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} ref={outputRef} sx={{ scrollMarginTop: 64 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>

          {result ? (
            <Stack spacing={2}>
              <Card sx={{ background: (t) => t.palette.accent.main, color: 'accent.contrastText', borderColor: 'accent.main' }}>
                <CardContent>
                  <Typography variant="subtitle2">
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

              <Box>
              <Grid container spacing={2}>
                <Grid size={6}>
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

                <Grid size={6}>
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

                <Grid size={6}>
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

                <Grid size={6}>
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

              </Box>

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
                border: '1px dashed',
                borderColor: 'tokens.rule',
                borderRadius: 0,
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
