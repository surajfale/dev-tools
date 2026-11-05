import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Clear, Transform, ScienceOutlined } from '@mui/icons-material';
import { convertJsonToYaml, convertYamlToJson } from '../lib/convertJsonYaml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import ToolActionBar from '../components/Common/ToolActionBar';
import useStoredState from '../components/Common/useStoredState';
import useRevealOnPhone from '../components/Common/useRevealOnPhone';
import CodeBlock from '../components/Common/CodeBlock';
import PageHeader from '../components/Common/PageHeader';

const sampleJson = `{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "app-config",
    "namespace": "default",
    "labels": {
      "app": "my-app",
      "version": "1.0.0"
    }
  },
  "data": {
    "database_host": "localhost",
    "database_port": "5432",
    "features": {
      "authentication": true,
      "logging": false,
      "cache_ttl": 300
    },
    "allowed_origins": [
      "https://example.com",
      "https://app.example.com"
    ]
  }
}`;

const sampleYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
  labels:
    app: my-app
    version: "1.0.0"
data:
  database_host: localhost
  database_port: "5432"
  features:
    authentication: true
    logging: false
    cache_ttl: 300
  allowed_origins:
    - https://example.com
    - https://app.example.com`;

const DIRECTIONS = ['json-to-yaml', 'yaml-to-json'];
const isDirection = (v) => DIRECTIONS.includes(v);

export default function JsonYaml() {
  const [input, setInput] = useStoredState('jsonyaml.input', '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [outputRef, revealOutput] = useRevealOnPhone();
  const [direction, setDirection] = useStoredState('jsonyaml.direction', 'json-to-yaml', isDirection);
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);

  const handleConvert = useCallback(() => {
    let result;

    if (direction === 'json-to-yaml') {
      result = convertJsonToYaml(input);
    } else {
      result = convertYamlToJson(input, { indent, minify });
    }

    if (result.success) {
      setOutput(result.result);
      setError('');
      revealOutput();
    } else {
      setError(result.error);
      setOutput('');
    }
  }, [input, direction, indent, minify, revealOutput]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleLoadSample = () => {
    if (direction === 'json-to-yaml') {
      setInput(sampleJson);
    } else {
      setInput(sampleYaml);
    }
    setError('');
  };

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setInput('');
    setOutput('');
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

  const isJsonToYaml = direction === 'json-to-yaml';
  const inputLabel = isJsonToYaml ? 'JSON Input' : 'YAML Input';
  const outputLabel = isJsonToYaml ? 'YAML Output' : 'JSON Output';
  const fileExtension = isJsonToYaml ? 'yaml' : 'json';

  return (
    <Box>
      <PageHeader title="JSON ↔ YAML Converter">
        Convert between JSON and YAML formats with validation and formatting options.
      </PageHeader>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Conversion Direction</InputLabel>
              <Select
                value={direction}
                label="Conversion Direction"
                onChange={(e) => handleDirectionChange(e.target.value)}
              >
                <MenuItem value="json-to-yaml">JSON → YAML</MenuItem>
                <MenuItem value="yaml-to-json">YAML → JSON</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {!isJsonToYaml && (
            <>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>JSON Indent</InputLabel>
                  <Select
                    value={indent}
                    label="JSON Indent"
                    onChange={(e) => setIndent(e.target.value)}
                  >
                    <MenuItem value={2}>2 spaces</MenuItem>
                    <MenuItem value={4}>4 spaces</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={minify}
                      onChange={(e) => setMinify(e.target.checked)}
                    />
                  }
                  label="Minify JSON"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            {inputLabel}
          </Typography>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${isJsonToYaml ? 'JSON' : 'YAML'} here...`}
            minRows={12}
            aria-label={inputLabel}
          />
          <ToolActionBar
            primary={{ label: 'Convert', icon: <Transform />, onClick: handleConvert, disabled: !input.trim() }}
            actions={[
              { label: 'Clear', icon: <Clear />, onClick: handleClear },
              { label: 'Sample', ariaLabel: 'Load sample input', icon: <ScienceOutlined />, onClick: handleLoadSample, color: 'secondary' },
            ]}
            onPaste={setInput}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} ref={outputRef} sx={{ scrollMarginTop: 64 }}>
          <Typography variant="h6" gutterBottom>
            {outputLabel}
          </Typography>
          <CodeBlock
            code={output}
            language={isJsonToYaml ? 'yaml' : 'json'}
            minRows={12}
            placeholder={`${isJsonToYaml ? 'YAML' : 'JSON'} output will appear here...`}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <CopyButton text={output} />
            <DownloadButton text={output} filename={`converted.${fileExtension}`} />
          </Stack>
        </Grid>
      </Grid>

      <ErrorAlert error={error} />
    </Box>
  );
}