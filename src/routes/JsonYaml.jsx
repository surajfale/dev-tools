import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Clear, Transform } from '@mui/icons-material';
import { convertJsonToYaml, convertYamlToJson } from '../lib/convertJsonYaml';
import CopyButton from '../components/Common/CopyButton';
import DownloadButton from '../components/Common/DownloadButton';
import ErrorAlert from '../components/Common/ErrorAlert';
import SampleInputButton from '../components/Common/SampleInputButton';

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

export default function JsonYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('json-to-yaml');
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);

  const handleConvert = () => {
    let result;
    
    if (direction === 'json-to-yaml') {
      result = convertJsonToYaml(input);
    } else {
      result = convertYamlToJson(input, { indent, minify });
    }
    
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
  }, [input, direction, indent, minify]);

  const isJsonToYaml = direction === 'json-to-yaml';
  const inputLabel = isJsonToYaml ? 'JSON Input' : 'YAML Input';
  const outputLabel = isJsonToYaml ? 'YAML Output' : 'JSON Output';
  const fileExtension = isJsonToYaml ? 'yaml' : 'json';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON ↔ YAML Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between JSON and YAML formats with validation and formatting options. 
        Use Ctrl/Cmd+Enter to convert quickly.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} md={6}>
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
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Transform />}
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
            <SampleInputButton onLoadSample={handleLoadSample} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {outputLabel}
          </Typography>
          <TextField
            value={output}
            placeholder={`${isJsonToYaml ? 'YAML' : 'JSON'} output will appear here...`}
            minRows={12}
            InputProps={{
              readOnly: true,
            }}
            aria-label={outputLabel}
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