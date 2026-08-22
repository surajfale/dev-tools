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
  Calculate,
  ArrowForward
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
    description: 'Preview HTML with live rendering. Share via a link that embeds the (minified) HTML directly — nothing leaves your browser.',
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
        Developer Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {tools.length} essential utilities to format, convert, and inspect data — all in the browser, nothing leaves your machine.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.path}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                outlineOffset: 2,
                '&:focus-visible': {
                  outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                },
                '&:hover': {
                  borderColor: `${tool.color}.main`,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 24px rgba(15,23,42,0.1)',
                  '@media (prefers-reduced-motion: no-preference)': {
                    transform: 'translateY(-3px)',
                  },
                  '& .tool-cta': {
                    color: `${tool.color}.main`,
                    transform: 'translateX(2px)',
                  },
                },
              }}
              onClick={() => navigate(tool.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(tool.path);
                }
              }}
              aria-label={`Open ${tool.title}`}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    mb: 2,
                    bgcolor: (theme) => alphaBg(theme, tool.color),
                    color: `${tool.color}.main`,
                  }}
                >
                  {tool.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {tool.description}
                </Typography>
                <Box
                  className="tool-cta"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 2,
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'transform 180ms ease, color 180ms ease',
                  }}
                >
                  Open tool
                  <ArrowForward sx={{ fontSize: 16 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function alphaBg(theme, color) {
  const channel = theme.palette[color]?.main;
  if (!channel) return theme.palette.action.hover;
  return theme.palette.mode === 'dark'
    ? `${channel}26`
    : `${channel}1A`;
}