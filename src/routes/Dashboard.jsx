import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box
} from '@mui/material';
import {
  Code,
  Storage,
  Schedule,
  Article,
  SwapHoriz,
  Visibility,
  Calculate
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const tools = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data with customizable indentation and key sorting.',
    icon: <Code />,
    path: '/json-formatter',
    color: 'primary'
  },
  {
    title: 'SQL Formatter',
    description: 'Format SQL queries with support for multiple dialects and customizable styling options.',
    icon: <Storage />,
    path: '/sql-formatter',
    color: 'secondary'
  },
  {
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps, ISO 8601, and human-readable date formats.',
    icon: <Schedule />,
    path: '/timestamp-converter',
    color: 'success'
  },
  {
    title: 'Markdown ↔ HTML',
    description: 'Convert between Markdown and HTML with live preview and safe HTML sanitization.',
    icon: <Article />,
    path: '/markdown-html',
    color: 'info'
  },
  {
    title: 'JSON ↔ YAML',
    description: 'Bidirectional conversion between JSON and YAML formats with validation.',
    icon: <SwapHoriz />,
    path: '/json-yaml',
    color: 'warning'
  },
  {
    title: 'HTML Preview',
    description: 'Preview HTML with live rendering. Upload to cloud for permanent shareable links (any file size).',
    icon: <Visibility />,
    path: '/html-preview',
    color: 'error'
  },
  {
    title: 'Math Calculator',
    description: 'Sum numbers separated by commas, spaces, or new lines. Shows sum, average, min, max, and count.',
    icon: <Calculate />,
    path: '/math-calculator',
    color: 'success'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Developer Tools Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        A collection of essential developer utilities to streamline your workflow. 
        Choose a tool below to get started.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.path}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              elevation={2}
              onClick={() => navigate(tool.path)}
              aria-label={`Open ${tool.title}`}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: `${tool.color}.main`, mr: 1 }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {tool.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}